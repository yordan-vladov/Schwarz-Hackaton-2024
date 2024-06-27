import { Pressable } from 'react-native';
import Icon from './Icon';

interface VisibilityToggleProps<E> {
    state: boolean,
    setState: React.Dispatch<React.SetStateAction<boolean>>
}

export default function VisiblityToggle<E>({state, setState}: VisibilityToggleProps<E>) {
    const handleOff = () => {
        setState(false);
    };
    
    const handleOn = () => {
        setState(true);
    };

    const offButton = (
        <Pressable onPress={handleOff}>
            <Icon library="Ionicons" name="eye-off" size={30} color="black" />
        </Pressable>
    );

    const onButton = (
        <Pressable onPress={handleOn}>
            <Icon library="Ionicons" name="eye" size={30} color="black" />
        </Pressable>
    );

    return (
        <>{state ? onButton : offButton}</>
    )
}