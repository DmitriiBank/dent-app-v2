import { resolveAssetUrl } from "../../utils/resolveAssetUrl.ts";

interface Props {
    image: string;
    onLoad?: () => void;
    onError?: () => void;
    alt?: string;
}

export const ImageItem = ({image, onLoad, onError, alt = "question"}: Props) => {
    return (
        <img
            src={resolveAssetUrl(image)}
            alt={alt}
            onLoad={onLoad}
            className="quiz-question__image"
            onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                onError?.();
            }}
        />

    );
};
