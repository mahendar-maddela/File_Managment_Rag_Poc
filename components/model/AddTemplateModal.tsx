"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/api/supabase/client";

interface AddTemplateModalProps {
  open: boolean;
  onClose: () => void;
  refresh: () => void;
  template?: any | null; // 👈 add this
}


const AddTemplateModal = ({ open, onClose, refresh, template }: AddTemplateModalProps) => {
  const [form, setForm] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  // ✅ prefill when editing
  useEffect(() => {
    if (template) {
      setForm({
        name: template.name || "",
        url: template.url || "",
        key: template.key || "",
        type: template.type || "",
      });
    } else {
      // reset when adding new
      setForm({ name: "", url: "", key: "", type: "" });
    }
  }, [template, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!form.name || !form.url || !form.key || !form.type) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    let errorRes;
    if (template) {
      // ✅ update mode
      const { error } = await supabase
        .from("Template")
        .update(form)
        .eq("id", template.id);
      errorRes = error;
    } else {
      // ✅ add mode
      const { error } = await supabase.from("Template").insert([form]);
      errorRes = error;
    }

    if (errorRes) {
      setError(errorRes.message);
    } else {
      refresh();
      onClose();
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{template ? "Edit Template" : "Add Template"}</DialogTitle>
          <DialogDescription>
            {template ? "Update the template details" : "Fill in the details to create a new template"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form?.name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
          <input
            type="text"
            name="url"
            placeholder="URL"
            value={form?.url}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
          <input
            type="text"
            name="key"
            placeholder="Key"
            value={form?.key}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
          <input
            type="text"
            name="type"
            placeholder="Type"
            value={form?.type}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : template ? "Update Template" : "Add Template"}
            </Button>

          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTemplateModal;


