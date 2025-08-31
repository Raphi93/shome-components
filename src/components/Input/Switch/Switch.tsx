
import "./Switch.css";
export interface SwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    size?: 'small' | 'medium' | 'large';
}
export function Switch({ checked, onChange, size = 'medium' }: SwitchProps) {
    const toggleSwitch = () => {
        onChange(!checked);
    };
    return (
        <div className={`switch switch-${size}`} onClick={toggleSwitch}>
            <input
                type="checkbox"
                className={'switch-input'}
                checked={checked}
                readOnly
            />
            <span className={'switch-slider'} />
        </div>
    );
}