import { AnswerItem } from "./AnswerItem.tsx";

type Props = {
    options: string[];
    onClick: (idx: number) => void;
    selected: number | null;
};

export const AnswersList = ({ options, onClick, selected }: Props) => {
    if (!options) {
        return <div>Нет данных для вариантов ответа.</div>;
    }
    return (
        <div className="options">
            {options.map((_, idx) => {
                const isSelected = selected === idx;
                const className = isSelected ? 'option selected' : 'option';

                return (
                    <AnswerItem
                        key={idx}
                        className={className}
                        answer={options[idx]}
                        onClick={() => onClick(idx)}
                    />
                );
            })}
        </div>
    );
};
