import { FormControl, Icon, Input, WarningOutlineIcon } from "native-base";
import { ResponsiveValue } from "native-base/lib/typescript/components/types";
import React from "react"
import { Controller } from "react-hook-form"

type Props = {
    control: any;
    name: string;
    title: string;
    type?: 'text' | 'password';
    required?: boolean;
    pattern?: any;
    placeholder?: string;
    returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send' | 'none' | 'previous' | 'default' | 'emergency-call' | 'google' | 'join' | 'route' | 'yahoo';
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'ascii-capable' | 'numbers-and-punctuation' | 'url' | 'number-pad' | 'name-phone-pad' | 'decimal-pad' | 'twitter' | 'web-search' | 'visible-password';
    icon?: any;
    errors?: string;
    isInvalid?: boolean;
    size?: ResponsiveValue<number | "full" | "sm" | "6" | "2xs" | "2" | "8" | "xs" | "3" | "12" | "md" | "4" | "16" | "xl" | "5" | "24" | "32" | "7" | "0.5" | "lg" | "1" | "2xl" | "2.5" | "1.5" | "10" | "20" | "64">;
    p?: number;
    iconSize?: ResponsiveValue<number | "full" | "sm" | "6" | "2xs" | "2" | "8" | "xs" | "3" | "12" | "md" | "4" | "16" | "xl" | "5" | "24" | "32" | "7" | "0.5" | "lg" | "1" | "2xl" | "2.5" | "1.5" | "10" | "20" | "64">;
    autoComplete?: 'birthdate-day' | 'birthdate-full' | 'birthdate-month' | 'birthdate-year' | 'cc-csc' | 'cc-exp' | 'cc-exp-day' | 'cc-exp-month' | 'cc-exp-year' | 'cc-number' | 'email' | 'gender' | 'name' | 'name-family' | 'name-given' | 'name-middle' | 'name-middle-initial' | 'name-prefix' | 'name-suffix' | 'password' | 'password-new' | 'postal-address' | 'postal-address-country' | 'postal-address-extended' | 'postal-address-extended-postal-code' | 'postal-address-locality' | 'postal-address-region' | 'postal-code' | 'street-address' | 'sms-otp' | 'tel' | 'tel-country-code' | 'tel-national' | 'tel-device' | 'username' | 'username-new' | 'off';
    iconRignt?: any;
    onSubmitEditing?: any;
    inputRef?: any;
    isFocused?: boolean;
    setFocus?: any;
    watch?: any;
    comparedMatch?: string,
    matchField?: string;
    isDisabled?: boolean;
}
const TextBox = (props: Props) => {
    const defaultPattern = /[\s\S]*/;
    return (
        <React.Fragment>
            <FormControl isInvalid={props.isInvalid} mt={3}>
                <FormControl.Label _text={{bold:false}} fontFamily={'Montserrat'} fontSize={'600'} color={'#302E37'}>{props.title}</FormControl.Label>
                <Controller
                    control={props.control}
                    rules={{
                        required: props.required,
                        pattern: props.pattern ?? defaultPattern,
                        validate: (val: string) => {
                            if (props?.watch && props.watch(props.matchField) != val) {
                                return props.comparedMatch;
                            }
                        }
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                            // name={props.name}
                            returnKeyType={props.returnKeyType ?? 'next'}
                            p={props.p ?? 2}
                            keyboardType={props.keyboardType}
                            InputLeftElement={
                                props.icon
                            }
                            InputRightElement={
                                props.iconRignt
                            }
                            placeholder={props.placeholder}
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            size={props.size ?? 'md'}
                            autoComplete={props.autoComplete}
                            type={props.type ?? 'text'}
                            onSubmitEditing={props.onSubmitEditing}
                            ref={props?.inputRef}
                            isFocused={props.isFocused}
                            isDisabled={props.isDisabled}
                        />
                    )}
                    name={props.name}
                />
                {props.isInvalid && (
                    <FormControl.ErrorMessage
                        leftIcon={<WarningOutlineIcon size={props.iconSize ?? 'xs'} />}
                    >
                        {props.errors}
                    </FormControl.ErrorMessage>
                )}
            </FormControl>
        </React.Fragment >
    )
}
export default TextBox;