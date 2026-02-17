"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "@/hooks/useTranslation";
import { Download, FileSpreadsheet, FileText } from "lucide-react";

interface ExportButtonProps {
  onExportCsv?: () => void;
  onExportPdf?: () => void;
  disabled?: boolean;
}

export function ExportButton({
  onExportCsv,
  onExportPdf,
  disabled,
}: ExportButtonProps) {
  const { t } = useTranslation("dashboard");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={disabled}>
          <Download className="size-4" />
          {t("export.export")}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {onExportCsv && (
          <DropdownMenuItem onClick={onExportCsv}>
            <FileSpreadsheet className="size-4" />
            {t("export.csv")}
          </DropdownMenuItem>
        )}
        {onExportPdf && (
          <DropdownMenuItem onClick={onExportPdf}>
            <FileText className="size-4" />
            {t("export.pdf")}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
