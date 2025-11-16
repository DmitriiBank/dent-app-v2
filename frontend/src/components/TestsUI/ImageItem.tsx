interface Props {
    image: string;
    onLoad?: () => void;
}

export const ImageItem = ({image, onLoad}: Props) => {
    return (
        <img
            src={import.meta.env.BASE_URL + image}
            alt="question"
            onLoad={onLoad}
            className="quiz-question__image"
            onError={(e) => {
                console.error('Ошибка загрузки изображения:', image);
                (e.target as HTMLImageElement).style.display = 'none';
            }}
        />

    );
};

