import { Checkbox, FormControl } from "native-base";
import React from "react";
import { Controller } from "react-hook-form";
type Props = {
    isInvalid?: boolean;
    title: string;
    control: any;
    required?: boolean;
    name: string;
    placeholder?: string;
}
const CheckBox = (props: Props) => {
    return (
        <React.Fragment>
            <FormControl isInvalid={props.isInvalid} mt={3}>
                <FormControl.Label _text={{ bold: false }} fontFamily={'Poppins'} fontSize={'600'} color={'#302E37'}>
                    {props.title}
                </FormControl.Label>
                <Controller
                    control={props.control}
                    rules={{
                        required: props.required
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <React.Fragment>
                            <Checkbox onChange={onChange} value="true" my="1">
                                {props.placeholder}
                            </Checkbox>
                        </React.Fragment>
                    )}
                    name={props.name}
                />
            </FormControl>
        </React.Fragment>
    )
}
export default CheckBox;