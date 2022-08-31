import { FormControl, Radio } from "native-base";
import React from "react";
import { Controller } from "react-hook-form";
interface IData {
    value: any;
    label: string
}
type Props = {
    isInvalid?: boolean;
    title: string;
    control: any;
    required?: boolean;
    name: string;
    data?: Array<IData>;
    placeholder?: string;
}
const RadioButton = (props: Props) => {
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
                            <Radio.Group defaultValue={'1'} name={props.name} accessibilityLabel={props.placeholder}>
                                {
                                    props.data?.map((x: IData, i: number) => (
                                        <Radio key={i} value={x.value as string} my="1">
                                            {x.label}
                                        </Radio>
                                    ))
                                }

                            </Radio.Group>
                        </React.Fragment>
                    )}
                    name={props.name}
                />
            </FormControl>
        </React.Fragment>
    )
}
export default RadioButton;