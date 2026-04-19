


import { Card, CardActionArea, CardContent, Box, Typography} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { useState } from 'react';
import type { Lecture } from '../../types/lecture.ts';

const Root = styled(Card)(({ theme }) => ({
    height: '100%',
    width: '100%',
    maxWidth: 320,
    margin: 0,
    borderRadius: 20,
    backgroundColor: theme.palette.mode === 'dark' ? alpha('#0f172a', 0.6) : '#fff',
    border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
    boxShadow: theme.palette.mode === 'dark'
        ? '0 16px 40px rgba(0,0,0,.35)'
        : '0 10px 30px rgba(25,118,210,.12)',
    transition: 'transform .18s ease, box-shadow .18s ease',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: theme.palette.mode === 'dark'
            ? '0 20px 50px rgba(0,0,0,.45)'
            : '0 16px 40px rgba(25,118,210,.18)',
    },
}));

type Props = {
    lecture: Lecture;
    onOpen: (lecture: Lecture) => void;
};

export default function LectureCard({ lecture, onOpen }: Props) {
    const status = lecture.status;
    const [imageError, setImageError] = useState(false);

    return (
        <Root>
            <CardActionArea sx={{ height: '100%', p: 2.5 }} onClick={() => status !== 'locked' && onOpen(lecture)}>
                <Box sx={{ display: 'grid', gridTemplateColumns: '96px 1fr', gap: 2 }}>
                    <Box
                        sx={{
                            width: 96,
                            height: 96,
                            borderRadius: '50%',
                            display: 'grid',
                            placeItems: 'center',
                            bgcolor:'rgba(248,246,241,0.95)',
                            border: '1px solid',
                            borderColor: 'divider',
                            overflow: 'hidden',
                        }}
                    >
                        {imageError ? (
                            <Typography variant="caption" color="text.secondary" textAlign="center" sx={{ px: 1 }}>
                                Нет изображения
                            </Typography>
                        ) : (
                            <img
                                src={lecture.iconUrl}
                                alt={lecture.title}
                                loading="lazy"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    display: 'block',
                                }}
                                onError={() => setImageError(true)}
                            />
                        )}
                    </Box>

                    <CardContent sx={{ p: 0, display: 'grid', alignContent: 'start', gap: 0.5, minWidth: 0 }}>
                        <Typography variant="h5" fontWeight={800} sx={{ fontSize: { xs: '1.1rem', sm: '1.4rem' } }}>
                            {lecture.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {lecture.subtitle}
                        </Typography>
                    </CardContent>
                </Box>
            </CardActionArea>
        </Root>
    );
}
