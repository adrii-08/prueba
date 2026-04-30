import { useState, useCallback } from 'react';
import { validate } from '../utils/helpers';

/**
 * Hook de formularios con validación visual.
 *
 * Uso:
 *   const form = useForm({
 *     initialValues: { name: '' },
 *     validations: { name: [validators.required] },
 *     onSubmit: async (values) => { ... }
 *   });
 */
export function useForm({ initialValues = {}, validations = {}, onSubmit }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const setValue = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    // Si el campo ya fue tocado, revalidamos al instante
    if (touched[name] && validations[name]) {
      const err = validate(value, validations[name]);
      setErrors((prev) => ({ ...prev, [name]: err }));
    }
  }, [touched, validations]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setValue(name, type === 'checkbox' ? checked : value);
  }, [setValue]);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    if (validations[name]) {
      const err = validate(values[name], validations[name]);
      setErrors((prev) => ({ ...prev, [name]: err }));
    }
  }, [values, validations]);

  const validateAll = useCallback(() => {
    const newErrors = {};
    let isValid = true;
    Object.keys(validations).forEach((name) => {
      const err = validate(values[name], validations[name]);
      if (err) {
        newErrors[name] = err;
        isValid = false;
      }
    });
    setErrors(newErrors);
    setTouched(
      Object.keys(validations).reduce((acc, k) => ({ ...acc, [k]: true }), {})
    );
    return isValid;
  }, [values, validations]);

  const handleSubmit = useCallback(async (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (!validateAll()) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await onSubmit?.(values);
    } catch (err) {
      setSubmitError(err.message || 'Error al guardar');
    } finally {
      setSubmitting(false);
    }
  }, [values, validateAll, onSubmit]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setSubmitError(null);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    submitting,
    submitError,
    setValue,
    setValues,
    handleChange,
    handleBlur,
    handleSubmit,
    validateAll,
    reset,
  };
}
