
import * as React from 'react';
import { Dialog, DialogContent, IconButton, Box, Typography } from '@mui/material';
import { X } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

type Props = {
    open: boolean;
    title: string;
    src?: string;         // PDF-URL (опционально)
    images?: string[];    // Массив URL картинок (опционально)
    onClose: () => void;
};

export default function LectureViewerDialog({ open, title, src, images = [], onClose }: Props) {
    const [numPages, setNumPages] = React.useState(0);
    const [containerWidth, setContainerWidth] = React.useState(
        Math.min(1000, Math.floor(window.innerWidth * 0.85))
    );

    React.useEffect(() => {
        const onResize = () =>
            setContainerWidth(Math.min(1000, Math.floor(window.innerWidth * 0.85)));
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    const isImagesMode = images.length > 0;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="lg"
            PaperProps={{ sx: { borderRadius: 3 } }}
        >
            <Box sx={{ display: 'flex', px: 2, pt: 1.5 }}>
                <Typography variant="h6" fontWeight={800} sx={{ flexGrow: 1 }}>
                    {title}
                </Typography>
                <IconButton onClick={onClose} aria-label="Close">
                    <X size={18} />
                </IconButton>
            </Box>

            <DialogContent
                dividers
                sx={{ pt: 1, pb: 2, maxHeight: '85vh' }}
            >
                <Box
                    sx={{
                        mx: 'auto',
                        width: '100%',
                        maxWidth: containerWidth,
                        display: 'grid',
                        gap: 2,              
                    }}
                >
                    {isImagesMode ? (
                        images.map((url, idx) => (
                            <Box
                                key={`${url}-${idx}`}
                                sx={{
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                    bgcolor: 'background.paper',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                }}
                            >
                                <img
                                    src={url}
                                    alt={`${title} ${idx + 1}/${images.length}`}
                                    loading="lazy"
                                    style={{ width: '100%', height: 'auto', display: 'block' }}
                                />
                            </Box>
                        ))
                    ) : src ? (
                        // Режим PDF: все страницы в колонку
                        <Document
                            file={src}
                            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                            loading={<Typography variant="body2">Загрузка PDF…</Typography>}
                        >
                            {Array.from({ length: numPages }, (_, i) => (
                                <Box
                                    key={`page-${i + 1}`}
                                    sx={{
                                        borderRadius: 2,
                                        overflow: 'hidden',
                                        bgcolor: 'background.paper',
                                        border: '1px solid',
                                        borderColor: 'divider',
                                    }}
                                >
                                    <Page
                                        pageNumber={i + 1}
                                        width={containerWidth}
                                        renderAnnotationLayer={false}
                                        renderTextLayer={false}
                                        loading=""
                                    />
                                </Box>
                            ))}
                        </Document>
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            Нет данных для отображения.
                        </Typography>
                    )}
                </Box>
            </DialogContent>
        </Dialog>
    );
}
