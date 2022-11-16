import { FunctionFragment } from "ethers/lib/utils";
import React, { Dispatch, ReactElement, SetStateAction } from "react";
import AddressInput from "../AddressInput";
import { ConvertStringToBytes, ConvertStringToBytes32, ConvertUintToEther } from "./utilsDisplay";

type ParamType = {
  name: string | null;
  type: string;
};

type TInputUIProps = {
  setForm: Dispatch<SetStateAction<Record<string, any>>>;
  form: Record<string, any>;
  stateObjectKey: string;
  paramType: ParamType;
  functionFragment: FunctionFragment;
};

/**
 * Generic Input component to handle input's based on their function param type
 */
const InputUI = ({ setForm, form, stateObjectKey, paramType }: TInputUIProps) => {
  let inputSuffix: ReactElement = <></>;

  switch (paramType.type) {
    case "bytes32":
      inputSuffix = <ConvertStringToBytes32 setForm={setForm} form={form} stateObjectKey={stateObjectKey} />;
      break;

    case "bytes":
      inputSuffix = <ConvertStringToBytes setForm={setForm} form={form} stateObjectKey={stateObjectKey} />;
      break;

    case "uint256":
      inputSuffix = <ConvertUintToEther setForm={setForm} form={form} stateObjectKey={stateObjectKey} />;
      break;
  }

  return (
    <div className="flex space-x-2 items-end">
      {paramType.type === "address" ? (
        <AddressInput
          placeholder={paramType.name ? paramType.type + " " + paramType.name : paramType.type}
          name={stateObjectKey}
          value={form[stateObjectKey]}
          onChange={(value): void => {
            const formUpdate = { ...form };
            formUpdate[stateObjectKey] = value;
            setForm(formUpdate);
          }}
        />
      ) : (
        <input
          placeholder={paramType.name ? paramType.type + " " + paramType.name : paramType.type}
          autoComplete="off"
          className="input input-bordered"
          name={stateObjectKey}
          value={form[stateObjectKey]}
          onChange={(event): void => {
            const formUpdate = { ...form };
            formUpdate[event.target.name] = event.target.value;
            setForm(formUpdate);
          }}
        />
      )}

      {inputSuffix}
    </div>
  );
};

export default InputUI;
