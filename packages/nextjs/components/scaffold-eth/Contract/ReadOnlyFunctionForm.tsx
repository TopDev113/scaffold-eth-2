import { FunctionFragment } from "ethers/lib/utils";
import { useState } from "react";
import { useContractRead } from "wagmi";
import { tryToDisplay } from "./utilsDisplay";
import InputUI from "./InputUI";
import { getFunctionInputKey } from "./utilsContract";
import { toast } from "~~/components/scaffold-eth";

const getInitialFormState = (functionFragment: FunctionFragment) => {
  const initialForm: Record<string, any> = {};
  functionFragment.inputs.forEach((input, inputIndex) => {
    const key = getFunctionInputKey(functionFragment, input, inputIndex);
    initialForm[key] = "";
  });
  return initialForm;
};

type TReadOnlyFunctionFormProps = {
  functionFragment: FunctionFragment;
  contractAddress: string;
};

export const ReadOnlyFunctionForm = ({ functionFragment, contractAddress }: TReadOnlyFunctionFormProps) => {
  const [form, setForm] = useState<Record<string, any>>(() => getInitialFormState(functionFragment));
  const keys = Object.keys(form);

  const {
    data: Result,
    isFetching,
    refetch,
  } = useContractRead({
    addressOrName: contractAddress,
    contractInterface: [functionFragment],
    functionName: functionFragment.name,
    args: keys.map(key => form[key]),
    enabled: false,
    onError: error => {
      toast.error(error.message);
    },
  });

  const inputs = functionFragment.inputs.map((input, inputIndex) => {
    const key = getFunctionInputKey(functionFragment, input, inputIndex);
    return (
      <InputUI
        key={key}
        setForm={setForm}
        form={form}
        stateObjectKey={key}
        paramType={input}
        functionFragment={functionFragment}
      />
    );
  });

  // TODO Handle Error with nice toast
  return (
    <div className="flex flex-col items-start space-y-2 border-b-2 border-black pb-2">
      <p className="text-black my-0">{functionFragment.name}</p>
      {inputs}
      <button
        className={`btn btn-primary btn-sm ${isFetching && "loading"}`}
        onClick={async () => {
          await refetch();
        }}
      >
        Read 📡
      </button>
      {tryToDisplay(Result)}
    </div>
  );
};
