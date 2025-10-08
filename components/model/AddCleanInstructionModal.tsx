"use client"

import { useForm } from "react-hook-form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type CleanInstruction = {
  extract: string
}

export default function AddCleanInstructionModal({
  isOpen,
  onClose,
  onSubmitInstruction,
}: {
  isOpen: boolean
  onClose: () => void
  onSubmitInstruction: (data: CleanInstruction) => void
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CleanInstruction>()

  const handleFormSubmit = (data: CleanInstruction) => {
    console.log("New Clean Instruction:", data)
    onSubmitInstruction(data)
    reset()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Clean Instruction</DialogTitle>
          <DialogDescription>
            Enter the cleaning instruction details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="extract">Extract</Label>
            <Input
              id="extract"
              placeholder="Page Number 2, like, abs..."
              {...register("extract", { required: "Extract is required" })}
              className="mt-3"
            />
            {errors.extract && (
              <p className="text-red-500 text-sm">{errors.extract.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
