

import { Card, CardActionArea, CardContent, Box, Typography, Chip } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import type { Lecture } from '../../types/lecture.ts';

const Root = styled(Card)(({ theme }) => ({
    height: 260,
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
    // const statusColor =
    //     status === 'done' ? 'success' : status === 'available' ? 'default' : 'warning';

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
                            bgcolor: 'background.paper',
                            border: '1px solid',
                            borderColor: 'divider',
                            overflow: 'hidden',
                        }}
                    >
                        <img src={lecture.iconUrl} alt="" width={64} height={64} style={{ opacity: 0.85 }} />
                    </Box>

                    <CardContent sx={{ p: 0, display: 'grid', alignContent: 'start', gap: 0.5 }}>
                        <Typography variant="h5" fontWeight={800}>
                            {lecture.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {lecture.subtitle}
                        </Typography>

                        <Box sx={{ mt: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip
                                label={
                                    status === 'done'
                                        ? 'Уже пройдён'
                                        : status === 'available'
                                            ? 'Доступен'
                                            : 'Заблокирован'
                                }
                                color={status === 'done' ? 'success' : status === 'locked' ? 'warning' : 'default'}
                                variant={status === 'available' ? 'outlined' : 'filled'}
                                size="small"
                            />
                        </Box>
                    </CardContent>
                </Box>
            </CardActionArea>
        </Root>
    );
}
