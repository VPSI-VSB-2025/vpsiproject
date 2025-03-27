// // components/ui/form-field.tsx
// "use client"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { FieldApi, useForm } from "@tanstack/react-form"
// import React from "react"
// import { UseFormReturn } from "react-hook-form"

// interface FormFieldProps<TFormData> {
//   // form: ReturnType<typeof useForm> // The form instance
//   form: UseFormReturn<any>
//   name: string
//   label: string
//   placeholder?: string
//   type?: "text" | "textarea" | "tel" | "email" | "radio" // Add more types as needed
//   validators?: {
//     onChange?: (field: { value: any }) => string | undefined
//     onSubmit?: (field: { value: any }) => string | undefined
//   }
//   children?: (
//     field: FieldApi<
//       any,
//       any,
//       any,
//       any,
//       any,
//       any,
//       any,
//       any,
//       any,
//       any,
//       any,
//       any,
//       any,
//       any,
//       any,
//       any,
//       any,
//       any,
//       any
//     >
//   ) => React.ReactNode // For custom rendering
//   className?: string
//   value?: string | number // For radio or other controlled inputs
//   checked?: boolean // For radio inputs
//   onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void // Optional custom onChange
// }

// export const FormField: React.FC<FormFieldProps> = ({
//   form,
//   name,
//   label,
//   placeholder = "",
//   type = "text",
//   validators = {},
//   children,
//   className = "",
//   value,
//   checked,
//   onChange,
// }) => {
//   return (
//     <form.Field name={name} validators={validators}>
//       {(field) => {
//         // If children prop is provided, use it for custom rendering
//         if (children) {
//           return (
//             <>
//               {children(field)}
//               {field.state.meta.errors.length > 0 && (
//                 <p className='text-red-500 text-sm mt-1'>
//                   <em>{field.state.meta.errors.join(", ")}</em>
//                 </p>
//               )}
//             </>
//           )
//         }

//         // Default rendering for standard inputs
//         const commonProps = {
//           id: name,
//           placeholder,
//           value: value !== undefined ? value : ((field.state.value ?? "") as string),
//           onChange: onChange || ((e) => field.handleChange(e.target.value)),
//           className,
//         }

//         return (
//           <div className='space-y-2'>
//             <Label htmlFor={name}>{label}</Label>
//             {type === "textarea" ? (
//               <Textarea {...commonProps} />
//             ) : type === "radio" ? (
//               <Input
//                 type='radio'
//                 name={name}
//                 value={value}
//                 checked={checked !== undefined ? checked : field.state.value === value}
//                 onChange={(e) => field.handleChange(Number(e.target.value))}
//                 className='hidden'
//               />
//             ) : (
//               <Input {...commonProps} type={type} />
//             )}
//             {field.state.meta.errors.length > 0 && (
//               <p className='text-red-500 text-sm'>
//                 <em>{field.state.meta.errors.join(", ")}</em>
//               </p>
//             )}
//           </div>
//         )
//       }}
//     </form.Field>
//   )
// }

// components/ui/form-field.tsx
"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FieldApi } from "@tanstack/react-form"
import React from "react"
import { UseFormReturn, FieldValues } from "react-hook-form"

interface FormFieldProps<TFormData extends FieldValues> {
  form: any
  name: keyof TFormData & string
  label: string
  placeholder?: string
  type?: "text" | "textarea" | "tel" | "email" | "radio"
  validators?: {
    onChange?: (field: { value: any }) => string | undefined // Relaxed typing for validators
    onSubmit?: (field: { value: any }) => string | undefined
  }
  children?: (
    field: FieldApi<
      TFormData,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any
    >
  ) => React.ReactNode
  className?: string
  value?: string | number
  checked?: boolean
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

export const FormField = <TFormData extends FieldValues>({
  form,
  name,
  label,
  placeholder = "",
  type = "text",
  validators = {},
  children,
  className = "",
  value,
  checked,
  onChange,
}: FormFieldProps<TFormData>) => {
  return (
    <form.Field name={name} validators={validators}>
      {(
        field: FieldApi<
          TFormData,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any
        >
      ) => {
        if (children) {
          return (
            <>
              {children(field)}
              {field.state.meta.errors.length > 0 && (
                <p className='text-red-500 text-sm mt-1'>
                  <em>{field.state.meta.errors.join(", ")}</em>
                </p>
              )}
            </>
          )
        }

        const commonProps: React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> = {
          id: name,
          placeholder,
          value: value !== undefined ? value : field.state.value || "",
          onChange: onChange || ((e) => field.handleChange(e.target.value)),
          className,
        }

        return (
          <div className='space-y-2'>
            <Label htmlFor={name}>{label}</Label>
            {type === "textarea" ? (
              <Textarea {...commonProps} />
            ) : type === "radio" ? (
              <input
                type='radio'
                name={name}
                value={value}
                checked={checked !== undefined ? checked : field.state.value === value}
                onChange={(e) => field.handleChange(Number(e.target.value))}
                className='hidden'
              />
            ) : (
              <Input {...commonProps} type={type} />
            )}
            {field.state.meta.errors.length > 0 && (
              <p className='text-red-500 text-sm'>
                <em>{field.state.meta.errors.join(", ")}</em>
              </p>
            )}
          </div>
        )
      }}
    </form.Field>
  )
}
