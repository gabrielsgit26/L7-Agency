'use client'

import * as React from 'react'
import {
  FormProvider,
  useFormContext,
  UseFormReturn,
  FieldValues,
  Path,
} from 'react-hook-form'

// Basic form wrappers
export const Form = FormProvider

export const FormItem: React.FC<
  React.PropsWithChildren
> = ({ children }) => <div className="mb-4">{children}</div>

export const FormLabel: React.FC<
  React.PropsWithChildren
> = ({ children }) => (
  <label className="block text-sm font-medium text-gray-700 mb-1">
    {children}
  </label>
)

export const FormControl: React.FC<
  React.PropsWithChildren
> = ({ children }) => <div>{children}</div>

export const FormMessage: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  if (!children) return null
  return <p className="text-sm text-red-500 mt-1">{children}</p>
}

// ============================================
// FormField: GENERIC & TS SAFE
// ============================================

interface FormFieldProps<T extends FieldValues> {
  form: UseFormReturn<T>  // ✅ ENTIRE form object
  name: Path<T>
  render: (props: { field: ReturnType<UseFormReturn<T>['register']> }) => React.ReactNode
}


export function FormField<T extends FieldValues>({
  form,
  name,
  render,
}: FormFieldProps<T>) {
  const { register, formState } = form
  const error = formState.errors[name]

  return (
    <FormItem>
      {render({ field: register(name) })}
      <FormMessage>{error && (error.message as string)}</FormMessage>
    </FormItem>
  )
}