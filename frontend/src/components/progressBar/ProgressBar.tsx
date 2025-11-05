
type Props = {
    currentQuestion: number;
    questionsLength: number;
}

export const ProgressBar = ({currentQuestion, questionsLength}: Props) => {
    return (
        <div className="progress-bar">
            <div
                className="progress"
                style={{
                    width: `${((currentQuestion) / questionsLength) * 100}%`
                }}
            />
        </div>
    );
};

