<?php
namespace App\Validation;

class Validator {
    private $errors = [];
    
    public function validate($data, $rules) {
        foreach ($rules as $field => $rule) {
            if (!isset($data[$field])) {
                $this->errors[$field] = "{$field} is required";
                continue;
            }
            
            foreach (explode('|', $rule) as $singleRule) {
                $this->validateField($field, $data[$field], $singleRule);
            }
        }
        
        return empty($this->errors);
    }
    
    private function validateField($field, $value, $rule) {
        switch ($rule) {
            case 'required':
                if (empty($value)) {
                    $this->errors[$field] = "{$field} cannot be empty";
                }
                break;
            case 'numeric':
                if (!is_numeric($value)) {
                    $this->errors[$field] = "{$field} must be a number";
                }
                break;
            // Add more validation rules...
        }
    }
    
    public function getErrors() {
        return $this->errors;
    }
} 