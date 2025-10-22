<?php

namespace App\Support;

class Branding
{
    public const DEFAULT_PRIMARY_COLOR = '#4A3DFF';
    public const DEFAULT_SIDEBAR_BACKGROUND_COLOR = '#FFFFFF';
    public const DEFAULT_SIDEBAR_TEXT_COLOR = '#111827';

    /**
     * Return the default branding settings keyed by company settings option.
     */
    public static function defaults(): array
    {
        return [
            'brand_primary_color' => self::DEFAULT_PRIMARY_COLOR,
            'brand_sidebar_background_color' => self::DEFAULT_SIDEBAR_BACKGROUND_COLOR,
            'brand_sidebar_text_color' => self::DEFAULT_SIDEBAR_TEXT_COLOR,
        ];
    }

    /**
     * Prepare sanitized branding values for persistence.
     */
    public static function prepare(array $input): array
    {
        $mapping = [
            'primary_color' => 'brand_primary_color',
            'sidebar_background_color' => 'brand_sidebar_background_color',
            'sidebar_text_color' => 'brand_sidebar_text_color',
        ];

        $prepared = [];

        foreach ($mapping as $inputKey => $settingKey) {
            if (array_key_exists($inputKey, $input)) {
                $prepared[$settingKey] = self::sanitizeHexColor(
                    $input[$inputKey],
                    self::defaults()[$settingKey]
                );
            }
        }

        return $prepared;
    }

    /**
     * Normalize a hex colour string or fall back to the provided default.
     */
    public static function sanitizeHexColor($value, string $default): string
    {
        if (! is_string($value)) {
            return $default;
        }

        $value = trim($value);

        if ($value === '') {
            return $default;
        }

        if (! preg_match('/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/', $value)) {
            return $default;
        }

        if (strlen($value) === 4) {
            $value = sprintf(
                '#%1$s%1$s%2$s%2$s%3$s%3$s',
                $value[1],
                $value[2],
                $value[3]
            );
        }

        return strtoupper($value);
    }
}
