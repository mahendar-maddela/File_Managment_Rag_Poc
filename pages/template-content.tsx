"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table, TableBody, TableCell, TableHeader, TableHead, TableRow,
} from "@/components/ui/table";
import AddTemplateModal from "@/components/model/AddTemplateModal";
import { supabase } from "@/api/supabase/client";
import { ConfirmationModal } from "@/components/model/ConfirmationModal";
import { Trash2, Edit } from "lucide-react";
import SkeletonRowComponent from "@/components/model/SkeletonRowComponet";

export default function TemplateTable() {
    const [templates, setTemplates] = useState<any[]>([]);
    const [openModal, setOpenModal] = useState(false);
    const [ediTableCellata, setEdiTableCellata] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<number | null>(null); // ✅ store id for delete
    const [confirmOpen, setConfirmOpen] = useState(false);

    const fetchTemplates = async () => {
        setLoading(true);
        const { data } = await supabase.from("Template").select("*");
        setTemplates(data || []);
        setLoading(false);
    };
    const handleDelete = async () => {
        if (!deleteId) return;
        await supabase.from("Template").delete().eq("id", deleteId);
        setDeleteId(null);
        setConfirmOpen(false);
        fetchTemplates();
    };

    useEffect(() => {
        fetchTemplates();
    }, []);

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="grid grid-cols-1 md:grid-cols-2 items-center">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Templates</h1>
                    <p className="text-muted-foreground">View and manage your templates</p>
                </div>
                <div className="flex justify-end mt-4 md:mt-0">
                    <button
                        onClick={() => { setEdiTableCellata(null); setOpenModal(true); }}
                        className="px-4 h-10 bg-primary text-white font-semibold text-sm rounded-md hover:bg-primary/90 transition-colors"
                    >
                        Create New Template
                    </button>
                </div>
            </div>

            {/* Card with Table */}
            <Card className="border-border/50">
                <CardHeader>
                    <CardTitle className="text-foreground">Templates</CardTitle>
                    <CardDescription>Your Prompts and API keys</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="relative overflow-x-auto rounded-lg border">
                        <div className="min-w-[800px]">
                            <Table className="w-full">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>URL</TableHead>
                                        <TableHead>Key</TableHead>
                                        <TableHead>Purpose</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        // Show 3 skeleton rows
                                        <>
                                            <SkeletonRowComponent rows={4} col={5} />
                                        </>
                                    ) : templates.length > 0 ? (
                                        templates.map((t) => (
                                            <TableRow key={t.id} className="border-t hover:bg-muted/50">
                                                <TableCell className="whitespace-nowrap">{t.name}</TableCell>
                                                <TableCell className="max-w-xs truncate" title={t.url}>{t.url}</TableCell>
                                                <TableCell className="max-w-xs truncate" title={t.key}>{t.key}</TableCell>
                                                <TableCell>{t.type}</TableCell>
                                                <TableCell>
                                                    <div className="flex space-x-2">
                                                        {/* Edit button */}
                                                        <button
                                                            onClick={() => { setEdiTableCellata(t); setOpenModal(true); }}
                                                            className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </button>

                                                        {/* Delete button */}
                                                        <button
                                                            onClick={() => { setDeleteId(t.id); setConfirmOpen(true); }}
                                                            className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                                                No templates found. Create your first template to get started.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Add/Edit Modal */}
            <AddTemplateModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                refresh={fetchTemplates}
                template={ediTableCellata}
            />

            {/* Delete Confirmation */}
            <ConfirmationModal
                isOpen={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleDelete}
                title="Delete Template"
                description="Are you sure you want to delete this template? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                variant="destructive"
                icon={<Trash2 className="h-5 w-5 text-destructive" />}
            />
        </div>
    );
}
