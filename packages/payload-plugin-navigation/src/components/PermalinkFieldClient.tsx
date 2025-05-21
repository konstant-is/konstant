"use client";

import type { UIFieldClientProps } from "payload";

import { useDocumentInfo, useFormFields } from "@payloadcms/ui";
import { useMemo } from "react";

type Props = {
  custom: {
    serverURL: string;
    sourceField: string;
  };
} & UIFieldClientProps;

export const PermalinkFieldClient: React.FC<Props> = ({ custom }) => {
  const { serverURL } = custom;
  const { id } = useDocumentInfo();

  // Listen to the field value
  const targetFieldValue = useFormFields(([fields]) => {
    return fields[custom.sourceField]?.value as string;
  });

  // Compute permalink only when necessary
  const processedValue = useMemo(() => {
    if (!targetFieldValue) {
      return "";
    }
    return `${serverURL}${targetFieldValue}`;
  }, [serverURL, targetFieldValue]);

  if (!id || !processedValue) {
    return null;
  }

  return (
    <div className="field-type permalinksField">
      <strong>Permalink:</strong>{" "}
      <a href={processedValue} rel="noopener noreferrer" target="_blank">
        {processedValue}
      </a>
    </div>
  );
};
