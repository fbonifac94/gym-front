import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormControlErrorResolverService {

  errorMessages = new Map<string, { [key: string]: string }>([
    [
      'registerForm:email', {
        required: 'El email es requerido.',
        maxlength: 'El número máximo de caracteres es 50.',
        email: 'El formato del email ingresado es inválido.',
      }
    ],
    [
      'registerForm:firstName', {
        required: 'El nombre es requerido.',
        minlength: 'El número mínimo de caracteres es 3.',
        maxlength: 'El número máximo de caracteres es 50.',
        pattern: 'El formato del nombre ingresado es inválido.',
      }
    ],
    [
      'registerForm:lastName', {
        required: 'El apellido es requerido.',
        minlength: 'El número mínimo de caracteres es 3.',
        maxlength: 'El número máximo de caracteres es 50.',
        pattern: 'El formato del apellido ingresado es inválido.',
      }
    ],
    [
      'registerForm:phone', {
        required: 'El número de teléfono es requerido.',
        minlength: 'El número mínimo de caracteres es 8.',
        maxlength: 'El número máximo de caracteres es 30.',
        pattern: 'El formato del número de teléfono ingresado es inválido.',
      }
    ],
    [
      'registerForm:bornDate', {
        required: 'La fecha de nacimiento es requerida.',
        invalidDate: 'La fecha ingresada es inválida.',
        underage: 'La persona debe tener al menos 18 años'
      }
    ],
    [
      'registerForm:country', {
        required: 'El país es requerido.',
        minlength: 'El número mínimo de caracteres es 4.',
        maxlength: 'El número máximo de caracteres es 50.',
        pattern: 'El formato del país ingresado es inválido.',
      }
    ],
    [
      'registerForm:city', {
        required: 'La ciudad es requerida.',
        minlength: 'El número mínimo de caracteres es 3.',
        maxlength: 'El número máximo de caracteres es 50.',
        pattern: 'El formato de la ciudad ingresada es inválido.',
      }
    ],
    [
      'registerForm:district', {
        required: 'El barrio es requerido.',
        minlength: 'El número mínimo de caracteres es 3.',
        maxlength: 'El número máximo de caracteres es 50.',
      }
    ],
    [
      'registerForm:address', {
        required: 'La dirección es requerida.',
        minlength: 'El número mínimo de caracteres es 3.',
        maxlength: 'El número máximo de caracteres es 50.',
      }
    ],
    [
      'registerForm:documentType', {
        required: 'El tipo de documento es requerido.',
      }
    ],
    [
      'registerForm:documentNumber', {
        required: 'El número de documento es requerido.',
        minlength: 'El número mínimo de caracteres es 5.',
        maxlength: 'El número máximo de caracteres es 50.',
        pattern: 'El formato del número de documento ingresado es inválido.',
      }
    ],
    [
      'loginForm:username', {
        required: 'El email es requerido.',
        email: 'El formato del email es inválido'
      }
    ],
    [
      'loginForm:password', {
        required: 'La contraseña es requerida.'
      }
    ],
    [
      'changePasswordForm:currentPassword', {
        required: 'La contraseña es requerida.'
      }
    ],
    [
      'changePasswordForm:newPassword', {
        required: 'La contraseña es requerida.',
        minlength: 'El número mínimo de caracteres es 8.',
        maxlength: 'El número máximo de caracteres es 50.',
      }
    ],
    [
      'changePasswordForm:confirmPassword', {
        required: 'La contraseña es requerida.',
        minlength: 'El número mínimo de caracteres es 8.',
        maxlength: 'El número máximo de caracteres es 50.',
        notMatching: 'Las contraseñas no coinciden.'
      }
    ],
    [
      'paymentForm:amount', {
        required: 'La cantidad de tiempo es requerida o el dato ingresado es inválido.',
        pattern: 'El campo solo acepta valores enteros.'
      }
    ],
    [
      'paymentForm:timeUnit', {
        required: 'La unidad de tiempo es requerida.',
      }
    ],
    [
      'paymentForm:paymentAmount', {
        required: 'El importe es requerido o el dato ingresado es inválido.',
        pattern: 'El formato ingresado es inválido.'
      }
    ],
    [
      'exerciseTypeForm:name', {
        required: 'El nombre del tipo de ejercicio es requerido.',
        pattern: 'El formato ingresado es inválido.',
        minlength: 'El número mínimo de caracteres es 5.',
        maxlength: 'El número máximo de caracteres es 50.',
      }
    ],
    [
      'exerciseForm:exerciseType', {
        required: 'El tipo de ejercicio es requerido.',
      }
    ],
    [
      'exerciseForm:name', {
        required: 'El nombre del ejercicio es requerido.',
        pattern: 'El formato ingresado es inválido.',
        minlength: 'El número mínimo de caracteres es 5.',
        maxlength: 'El número máximo de caracteres es 80.',
      }
    ],
    [
      'emailForgotPasswordForm:email', {
        required: 'El email es requerido.',
        email: 'Ingrese un email válido.',
        serverError: 'El email ingresado es inválido.',
      }
    ],
    [
      'codeForgotPasswordForm:code', {
        required: 'El código es requerido.',
        invalidCode: 'Código inválido.',
        serverError: 'Error al validar el código.',
      }
    ],
    [
      'passwordForgotPasswordForm:newPassword', {
        required: 'La contraseña es requerida.',
        minlength: 'El número mínimo de caracteres es 8.',
        maxlength: 'El número máximo de caracteres es 50.',
        serverError: 'Error al guardar la contraseña.',
      }
    ],
    [
      'passwordForgotPasswordForm:confirmPassword', {
        required: 'La confirmación de la contraseña es requerida.',
        minlength: 'El número mínimo de caracteres es 8.',
        maxlength: 'El número máximo de caracteres es 50.',
        notMatching: 'Las contraseñas no coinciden.'
      }
    ],
    [
      'classForm:name', {
        required: 'El nombre de la clase es requerido.',
        pattern: 'Formato inválido del nombre de la clase.',
        minlength: 'El nombre de la clase debe tener al menos 4 caracteres',
        maxlength: 'El nombre de la clase debe tener como máximo 60 caracteres',
      }
    ],
    [
      'classForm:day', {
        required: 'El día de la clase es requerido.',
      }
    ],
    [
      'classForm:teacher', {
        required: 'El profesor de la clase requerido.',
      }
    ],
    [
      'classForm:initSchedule', {
        required: 'El horario de inicio de la clase es requerido.',
      }
    ],
    [
      'classForm:endSchedule', {
        required: 'El horario de fin de la clase es requerido.',
        invalidSchedule: 'El horario de fin no puede ser menor o igual al de inicio.'
      }
    ],
    [
      'classForm:capacity', {
        required: 'El cupo de la clase es requerido.',
        min: 'El cupo de la clase debe ser de al menos 1.'
      }
    ],

  ]);

  constructor() { }

  getErrorMessage(form: FormGroup, controlNameFromForm: string): string | null {
    const controlName = controlNameFromForm.split(':')[1];
    const control = form.get(controlName);
    if (control && control.errors) {
      const errorKey = Object.keys(control.errors)[0];
      return this.errorMessages.get(controlNameFromForm)?.[errorKey] || '';
    }
    return null;
  }
}