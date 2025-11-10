

import { Card, CardActionArea, CardContent, Box, Typography } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import type { Tooth } from '../../utils/lecture-types.ts';

const Root = styled(Card)(({ theme }) => ({
    height: 260,
    width: 280,
    margin: 20,
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
    tooth: Tooth;
    onClick: (id: string) => void;
};

export default function ToothCard({ tooth, onClick }: Props) {

    return (
        <Root>
            <CardActionArea
                sx={{ height: '100%', p: 2.5, alignContent: 'start' }}
                onClick={() => onClick(tooth.id)}
            >
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
                        <img
                            src={tooth.icon}
                            alt=""
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                            }}
                        />
                    </Box>

                    <CardContent sx={{ p: 0, display: 'grid', alignContent: 'start', gap: 0.5 }}>
                        <Typography variant="h5" fontWeight={800}>
                            {tooth.title}
                        </Typography>
                    </CardContent>
                </Box>
            </CardActionArea>
        </Root>
    );
}
