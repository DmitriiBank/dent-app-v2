
interface Props {
    image: string;
    onLoad?: () => void;
}
export const ImageItem = ({image, onLoad} : Props) => {
    return (
        <div className="question-image-container">
            <img
                src={import.meta.env.BASE_URL + image}
                alt="question"
                onLoad={onLoad}
                className="question-image"
                onError={(e) => {
                    console.error('Ошибка загрузки изображения:', image);
                    (e.target as HTMLImageElement).style.display = 'none';
                }}
            />
        </div>
    );
};

