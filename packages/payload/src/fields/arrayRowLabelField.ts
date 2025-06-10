export const arrayRowLabelField = (props: {
  fieldName: string;
  prefix: string;
}) => {
  return {
    clientProps: props,
    path: "@konstant/payload/client#ArrayRowLabel",
  };
};
