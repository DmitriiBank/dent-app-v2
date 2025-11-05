
type Props ={
    className: string
    answer: string;
    onClick: () => void;
}
export const AnswerItem = ({className, answer, onClick}:Props) => {
    return (
        <div
            className={className}
            onClick={onClick}
        >
            {answer}
        </div>
    );
};

