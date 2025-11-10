
import {useEffect, useRef, useState} from 'react';
import {Box, IconButton} from '@mui/material';
import {alpha, styled} from '@mui/material/styles';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

type Props = {
    images: string[];
    alt?: string;
    initialIndex?: number;
};

const Thumb = styled('button')(({theme}) => ({
    all: 'unset',
    cursor: 'pointer',
    borderRadius: 10,
    overflow: 'hidden',
    width: 96,
    height: 72,
    flex: '0 0 auto',
    border: `1px solid ${alpha(theme.palette.divider, 0.9)}`,
    background: theme.palette.background.paper,
    display: 'grid',
    placeItems: 'center',
    transition: 'transform .15s ease, box-shadow .15s ease, border-color .15s ease',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: theme.palette.mode === 'dark'
            ? '0 12px 30px rgba(0,0,0,.35)'
            : '0 8px 20px rgba(25,118,210,.12)',
        borderColor: theme.palette.primary.main,
    }
}));

export default function ImageGallery({ images, alt = 'image', initialIndex = 0 }: Props) {
    const [current, setCurrent] = useState(initialIndex);
    const mainRef = useRef<HTMLDivElement | null>(null);

    const total = images.length;
    const prev = () => setCurrent(i => (i - 1 + total) % total);
    const next = () => setCurrent(i => (i + 1) % total);
    const select = (idx: number) => setCurrent(idx);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') prev();
            if (e.key === 'ArrowRight') next();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [total]);

    if (!images || total === 0) return null;

    return (
        <Box sx={{ width: '100%', display: 'grid', gap: 1.5 }}>

            <Box
                ref={mainRef}
                sx={{
                    position: 'relative',
                    borderRadius: 2,
                    overflow: 'hidden',
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    // aspectRatio: '16 / 9',
                    display: 'grid',
                    placeItems: 'center',
                }}
            >
                <img
                    src={images[current]}
                    alt={`${alt} ${current + 1}/${total}`}
                    // style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />

                {total > 1 && (
                    <>
                        <IconButton
                            onClick={prev}
                            size="small"
                            sx={{
                                position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)',
                                bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider',
                                '&:hover': { bgcolor: 'background.paper' }
                            }}
                        >
                            <ArrowBackIosNewIcon fontSize="small" />
                        </IconButton>

                        <IconButton
                            onClick={next}
                            size="small"
                            sx={{
                                position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                                bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider',
                                '&:hover': { bgcolor: 'background.paper' }
                            }}
                        >
                            <ArrowForwardIosIcon fontSize="small" />
                        </IconButton>
                    </>
                )}
            </Box>


            {total > 1 && (
                <Box
                    sx={{
                        mt: 0.5,
                        display: 'flex',
                        gap: 1,
                        overflowX: 'auto',
                        py: 0.5,
                    }}
                >
                    {images.map((src, idx) =>
                        idx === current ? null : (
                            <Thumb key={`${src}-${idx}`} onClick={() => select(idx)} aria-label={`preview ${idx + 1}`}>
                                <img
                                    src={src}
                                    alt={`${alt} preview ${idx + 1}`}
                                    width={96}
                                    height={72}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                />
                            </Thumb>
                        )
                    )}
                </Box>
            )}
        </Box>
    );
}
