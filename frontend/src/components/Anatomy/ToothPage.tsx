import {Box, Chip} from "@mui/material";
import {TEETH} from "../../utils/lecture-types.ts";
import {useParams} from "react-router-dom";
import ImageGallery from "../gallery/ImageGallery.tsx";

export const ToothPage = () => {
    const { id } = useParams();
    const tooth = TEETH.find(t => t.id === id);
    if(!tooth)
        return (
            <div>
                Данные не найдены!!!
            </div>
        )

    const hasVideo = Boolean(tooth.videoUrl);
    const images = tooth.imagesUrl ?? [];
    const hasImages = images.length > 0;

    return (
        <div>
            <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                {hasVideo && (
                    <Chip
                        size="small"
                        color="primary"
                        label="Видео"
                        onClick={() => window.open(tooth.videoUrl!, '_blank', 'noopener,noreferrer')}
                    />
                )}
                {hasImages && <Chip size="small" variant="outlined" label={`Изображения: ${images.length}`} />}
                {!hasVideo && !hasImages && <Chip size="small" variant="outlined" label="Нет материалов" />}
            </Box>

            {hasImages && (
                <Box sx={{ mt: 2 }}>
                    <ImageGallery images={images} alt={tooth.title} />
                </Box>
            )}
        </div>
    );
};

