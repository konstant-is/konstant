'use client'

import type { TextFieldClientProps } from 'payload'

import { Button, FieldLabel, TextInput, useField, useForm, useFormFields } from '@payloadcms/ui'
import React, { useCallback, useMemo } from 'react'

import type { SlugifyOptions } from '../types.js'

import { cx } from '../utils/cx.js'
import { generateSlug } from '../utils/slugify.js'
import css from './SlugField.module.css'

type Props = {
  custom: {
    autoIncrementSlug: boolean
    checkboxFieldPath: string
    slugifyOptions: { remove: string } & Omit<SlugifyOptions, 'remove'>
    watchFields: string[]
  }
} & TextFieldClientProps

export const SlugFieldClient: React.FC<Props> = ({
  custom,
  field,
  path,
  readOnly: readOnlyFromProps,
}) => {
  const { label } = field
  const {
    autoIncrementSlug,
    checkboxFieldPath: checkboxFieldPathFromProps,
    slugifyOptions,
    watchFields,
  } = custom

  const checkboxFieldPath = path?.includes('.')
    ? `${path}.${checkboxFieldPathFromProps}`
    : checkboxFieldPathFromProps

  const { setValue, value } = useField<string>({ path: path || field.name })

  const { dispatchFields } = useForm()

  // The value of the checkbox
  // We're using separate useFormFields to minimise re-renders
  const checkboxValue = useFormFields(([fields]) => {
    return fields[checkboxFieldPath]?.value as string
  })

  const fields = useFormFields(([fields]) => {
    return watchFields.map((watch) => fields[watch])
  })

  const processedValue = useMemo(() => {
    const slug = generateSlug(fields, slugifyOptions)

    if (value !== slug && autoIncrementSlug) {
      return value
    }

    return slug
  }, [fields, slugifyOptions, value, autoIncrementSlug])

  React.useEffect(() => {
    if (checkboxValue) {
      if (processedValue !== value) {
        setValue(processedValue)
      }
    }
  }, [setValue, checkboxValue, processedValue, value])

  const handleLock = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()

      dispatchFields({
        type: 'UPDATE',
        path: checkboxFieldPath,
        value: !checkboxValue,
      })
    },
    [checkboxValue, checkboxFieldPath, dispatchFields],
  )

  const readOnly = readOnlyFromProps || checkboxValue

  return (
    <div className={cx('field-type', css.ctr)}>
      <div className={cx(css.label_wrapper)}>
        <FieldLabel
          hideLocale={false}
          htmlFor={`field-${path}`}
          label={label}
          localized={true}
          required={field.required}
        />

        <Button buttonStyle="none" className={cx(css.lock_button)} onClick={handleLock}>
          {checkboxValue ? 'Unlock' : 'Lock'}
        </Button>
      </div>

      <TextInput
        onChange={setValue}
        path={path || field.name}
        readOnly={Boolean(readOnly)}
        value={value}
      />
    </div>
  )
}
