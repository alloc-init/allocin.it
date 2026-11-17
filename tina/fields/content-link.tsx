import * as React from "react";
import { BaseTextField, Button, wrapFieldsWithMeta } from "tinacms";
import { type LinkMetadata, publicLinkUrl } from "../link-metadata";
import { fetchLinkMetadata } from "../link-preview";

const metadataFields: (keyof LinkMetadata)[] = [
  "title", "publisher", "description", "category", "date", "image",
];

// Tina's field renderer supplies the form handles that its collection schema types omit.
export const ContentLinkInput: React.FC = wrapFieldsWithMeta(function ContentLinkInput({ input, form, tinaForm }) {
  const [busy, setBusy] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const request = React.useRef<AbortController | null>(null);
  const suggestions = React.useRef(new Map<keyof LinkMetadata, { before?: string; value: string }>());
  React.useEffect(() => {
    const unsubscribe = form.subscribe(({ pristine }) => {
      // Reset (or returning every field to its initial value) starts a fresh card.
      if (!pristine) return;
      request.current?.abort();
      suggestions.current.clear();
      setBusy(false);
      setMessage("");
    }, { pristine: true });
    return () => {
      unsubscribe();
      request.current?.abort();
    };
  }, [form]);

  if (tinaForm.crudType !== "create") {
    return <BaseTextField {...input} id={input.name} type="url" />;
  }

  function changeLink(value: string) {
    if (value === form.getState().values[input.name]) return;
    request.current?.abort();
    setMessage("");
    setBusy(false);
    form.batch(() => {
      for (const [field, suggestion] of suggestions.current) {
        if (form.getState().values[field] === suggestion.value) {
          form.change(field, suggestion.before);
        }
      }
      suggestions.current.clear();
      input.onChange(value);
    });
  }

  async function fill(value: string) {
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    setMessage("Fetching details… Please wait.");
    setBusy(true);
    const timeout = window.setTimeout(() => {
      if (controller.signal.aborted) return;
      controller.abort();
      setMessage("The site took too long to respond. Try again or enter the details manually.");
      setBusy(false);
    }, 30000);
    try {
      const { signal } = controller;
      const initial = form.getState().values;
      const metadata = await fetchLinkMetadata(value, signal);
      window.clearTimeout(timeout);
      if (signal.aborted) return;
      const current = form.getState().values;
      if (current[input.name] !== value) return;
      let filled = 0;
      form.batch(() => {
        for (const field of metadataFields) {
          const next = metadata[field];
          const before = current[field];
          const useDefaultCategory = field === "category" && before === "media" &&
            !form.getFieldState(field)?.touched && !form.getFieldState(field)?.active;
          if (!next || before !== initial[field] || before === next || (before && !useDefaultCategory)) continue;
          form.change(field, next);
          suggestions.current.set(field, { before, value: next });
          filled++;
        }
      });
      setMessage(filled ? "Details filled in. Review them before saving." : "No new details found. You can complete the card manually.");
    } catch (error) {
      if (!controller.signal.aborted) {
        setMessage(error instanceof Error ? error.message : "Could not read this link. Try again or enter the details manually.");
      }
    } finally {
      window.clearTimeout(timeout);
      if (!controller.signal.aborted) setBusy(false);
    }
  }

  return (
    <>
      <BaseTextField
        {...input}
        id={input.name}
        type="url"
        placeholder="https://…"
        onChange={(event) => changeLink(event.currentTarget.value)}
        onPaste={(event) => {
          const value = event.clipboardData.getData("text/plain").trim();
          if (!publicLinkUrl(value)) return;
          event.preventDefault();
          changeLink(value);
          void fill(value);
        }}
      />
      <p className="mt-2 text-xs text-gray-600">Paste a public link to fill this card using YouTube or Jina Reader.</p>
      <Button
        type="button"
        size="small"
        variant="white"
        className="mt-2"
        style={{ minWidth: "7rem" }}
        busy={busy}
        aria-busy={busy}
        aria-label={busy ? "Fetching link details" : "Fill from link"}
        disabled={busy || !publicLinkUrl(input.value)}
        onClick={() => void fill(input.value)}
      >
        Fill from link
      </Button>
      <p role="status" className={busy ? "mt-2 text-sm font-medium text-blue-500" : "mt-2 text-xs text-gray-600"}>{message}</p>
    </>
  );
});
