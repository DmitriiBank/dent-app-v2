// pages/LecturesPage.tsx
import * as React from 'react';
import { Container, Grid, Typography } from '@mui/material';
import LectureCard from './LectureCard';
import LectureViewerDialog from './LectureViewerDialog';
import { LECTURES } from '../../types/lecture.ts';
import type { Lecture } from '../../types/lecture.ts';

const LecturesPage= () =>  {
    const [open, setOpen] = React.useState(false);
    const [active, setActive] = React.useState<Lecture | null>(null);

    const handleOpen = (lec: Lecture) => {
        setActive(lec);
        setOpen(true);
    };
    const handleClose = () => setOpen(false);

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" fontWeight={900} sx={{ mb: 3, textAlign: 'center' }}>
                Выберите лекцию
            </Typography>

            <Grid container spacing={3}>
                {LECTURES.map((lec) => (
                    <LectureCard
                        key={lec.id}
                        lecture={lec}
                        onOpen={handleOpen}
                    />
                ))}
            </Grid>

            {active && (
                <LectureViewerDialog
                    open={open}
                    onClose={handleClose}
                    title={active.title}
                    src={active.pdfUrl}
                />
            )}
        </Container>
    );
}

export default LecturesPage;