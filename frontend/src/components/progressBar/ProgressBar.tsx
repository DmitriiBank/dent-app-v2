type Props = {
    currentQuestion: number;
    questionsLength: number;
}

export const ProgressBar = ({currentQuestion, questionsLength}: Props) => {
    return (
        <div className="quiz-progress">
            <div

                className="quiz-progress__fill"
                style={{
                    width: `${((currentQuestion) / questionsLength) * 100}%`
                }}
            />
        </div>
    );
};

