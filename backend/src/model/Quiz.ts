import mongoose, {Document} from 'mongoose';


export interface Question extends Document{
    quiz: mongoose.Types.ObjectId;
    question: string;
    image?: string;
    options: string[];
    answer: number;
}


export interface Quiz extends Document{
    _id: string
    title: string;
    icon?: string;
    description: string;
}

