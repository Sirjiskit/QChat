import { CheckIcon, FormControl, Select, WarningOutlineIcon } from "native-base";
import React from "react"
import { Controller } from "react-hook-form";
import { IComboBox } from "../../interface";

type Props = {
    isInvalid?: boolean;
    title: string;
    control: any;
    required?: boolean;
    placeholder?: string;
    name: string;
    data: IComboBox[];
    onChange?: any;
    errors?: string;
}
const ComboBox = (props: Props) => {
    return (
        <React.Fragment>
            <FormControl isInvalid={props.isInvalid} mt={3}>
                <FormControl.Label>{props.title}</FormControl.Label>
                <Controller
                    control={props.control}
                    rules={{
                        required: props.required
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <React.Fragment>
                            <Select onValueChange={(value) => {
                                onChange(value);
                                if (typeof props?.onChange === 'function') {
                                    props?.onChange(value);
                                }
                            }} selectedValue={value} minWidth="200" accessibilityLabel={props.placeholder} placeholder={props.placeholder} _selectedItem={{
                                bg: "gray.300",
                                endIcon: <CheckIcon size={5} />
                            }} mt="1">
                                {props.data.map((x: IComboBox, index: number) => (
                                    <Select.Item key={index} label={x.label} value={x.value} />
                                ))}
                            </Select>
                            {props.isInvalid && (<FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                {props.errors}
                            </FormControl.ErrorMessage>)}
                        </React.Fragment>
                    )}
                    name={props.name}
                />
            </FormControl>
        </React.Fragment>
    )
}
export default ComboBox;