// components/lectures/LectureViewerDialog.tsx
import * as React from 'react';
import { Dialog, DialogContent, IconButton, Box, Typography } from '@mui/material';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

type Props = {
    open: boolean;
    title: string;
    src: string;
    onClose: () => void;
};

export default function LectureViewerDialog({ open, title, src, onClose }: Props) {
    const [numPages, setNumPages] = React.useState(0);
    const [page, setPage] = React.useState(1);

    React.useEffect(() => {
        if (open) setPage(1);
    }, [open]);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg" PaperProps={{ sx: { borderRadius: 3 } }}>
            <Box sx={{ display: 'flex', px: 2, pt: 1.5 }}>
                <Typography variant="h6" fontWeight={800} sx={{ flexGrow: 1 }}>
                    {title}
                </Typography>
                <IconButton onClick={onClose} aria-label="Close">
                    <X size={18} />
                </IconButton>
            </Box>

            <DialogContent sx={{ pt: 1, pb: 2 }}>
                <Box sx={{ display: 'grid', placeItems: 'center', gap: 2 }}>
                    <Document file={src} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
                        <Page
                            pageNumber={page}
                            width={Math.min(1000, Math.floor(window.innerWidth * 0.85))}
                            renderAnnotationLayer={false}
                            renderTextLayer={false}
                        />
                    </Document>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                            <ChevronLeft />
                        </IconButton>
                        <Typography variant="body2">
                            {page} / {numPages || '…'}
                        </Typography>
                        <IconButton disabled={page >= numPages} onClick={() => setPage((p) => Math.min(numPages, p + 1))}>
                            <ChevronRight />
                        </IconButton>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
}
