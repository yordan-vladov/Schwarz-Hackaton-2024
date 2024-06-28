import { Pressable } from 'react-native';
import Icon from './Icon';

interface VisibilityToggleProps {
    state: boolean,
    setState: React.Dispatch<React.SetStateAction<boolean>>
}

export default function VisibilityToggle({ state, setState }: VisibilityToggleProps) {
    const toggleVisibility = () => {
        setState(prevState => !prevState);
    };

    return (
        <Pressable onPress={toggleVisibility}>
            <Icon library="Ionicons" name={state ? "eye-off" : "eye"} size={30} color="black" />
        </Pressable>
    );
}
