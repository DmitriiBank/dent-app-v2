import {Container, Typography} from '@mui/material';
import ToothCard from './ToothCard.tsx';
import {useNavigate} from "react-router-dom";
import {TEETH} from "../../types/tooth-types.ts";

const TeethPage = () => {
    const navigate = useNavigate();
    const handleSelect = (id: string) => navigate(`/anatomy/${id}`);

    return (
        <div className="quiz-selection-container">
            <Container
                maxWidth="lg"
                sx={{py: 4}}
            >
                <Typography
                    variant="h4"
                    fontWeight={900}
                    sx={{mb: 3, textAlign: 'center'}}
                >
                    Анатомия зубов
                </Typography>

                <div className="quiz-categories">
                    {TEETH.map((tooth) => (
                        <ToothCard
                            key={tooth.id}
                            tooth={tooth}
                            onClick={handleSelect}
                        />
                    ))}
                </div>
            </Container>
        </div>
    );
}

export default TeethPage;