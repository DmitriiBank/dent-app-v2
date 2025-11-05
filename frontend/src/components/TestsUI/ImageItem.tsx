
interface Props {
    image: string;
}
export const ImageItem = ({image} : Props) => {
    return (
        <div className="question-image-container">
            <img
                src={import.meta.env.BASE_URL + image}
                alt="question"
                className="question-image"
                onError={(e) => {
                    console.error('Ошибка загрузки изображения:', image);
                    (e.target as HTMLImageElement).style.display = 'none';
                }}
            />
        </div>
    );
};

