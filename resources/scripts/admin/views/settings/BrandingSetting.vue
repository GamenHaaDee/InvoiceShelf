<template>
  <form class="relative" @submit.prevent="submitBranding">
    <BaseSettingCard
      :title="$t('settings.branding.title')"
      :description="$t('settings.branding.description')"
    >
      <BaseInputGrid class="mt-5">
        <BaseInputGroup
          :label="$t('settings.branding.primary_color_label')"
          :error="
            v$.primary_color.$error && v$.primary_color.$errors[0].$message
          "
          required
        >
          <div class="flex items-center gap-3">
            <input
              :value="brandingForm.primary_color"
              type="color"
              class="h-10 w-14 cursor-pointer rounded border border-gray-300 bg-transparent p-0"
              @input="onBrandingColorInput('primary_color', $event.target.value)"
            />
            <BaseInput
              :model-value="brandingForm.primary_color"
              @update:modelValue="onBrandingHexInput('primary_color', $event)"
              @blur="onBrandingHexBlur('primary_color')"
              placeholder="#4A3DFF"
            />
          </div>
        </BaseInputGroup>

        <BaseInputGroup
          :label="$t('settings.branding.sidebar_background_label')"
          :error="
            v$.sidebar_background_color.$error &&
            v$.sidebar_background_color.$errors[0].$message
          "
          required
        >
          <div class="flex items-center gap-3">
            <input
              :value="brandingForm.sidebar_background_color"
              type="color"
              class="h-10 w-14 cursor-pointer rounded border border-gray-300 bg-transparent p-0"
              @input="
                onBrandingColorInput(
                  'sidebar_background_color',
                  $event.target.value
                )
              "
            />
            <BaseInput
              :model-value="brandingForm.sidebar_background_color"
              @update:modelValue="
                onBrandingHexInput('sidebar_background_color', $event)
              "
              @blur="onBrandingHexBlur('sidebar_background_color')"
              placeholder="#FFFFFF"
            />
          </div>
        </BaseInputGroup>

        <BaseInputGroup
          :label="$t('settings.branding.sidebar_text_label')"
          :error="
            v$.sidebar_text_color.$error &&
            v$.sidebar_text_color.$errors[0].$message
          "
          required
        >
          <div class="flex items-center gap-3">
            <input
              :value="brandingForm.sidebar_text_color"
              type="color"
              class="h-10 w-14 cursor-pointer rounded border border-gray-300 bg-transparent p-0"
              @input="
                onBrandingColorInput('sidebar_text_color', $event.target.value)
              "
            />
            <BaseInput
              :model-value="brandingForm.sidebar_text_color"
              @update:modelValue="
                onBrandingHexInput('sidebar_text_color', $event)
              "
              @blur="onBrandingHexBlur('sidebar_text_color')"
              placeholder="#111827"
            />
          </div>
        </BaseInputGroup>
      </BaseInputGrid>

      <div class="mt-8">
        <h4 class="text-sm font-medium text-gray-900">
          {{ $t('settings.branding.preview_title') }}
        </h4>
        <p class="mt-1 text-sm text-gray-500">
          {{ $t('settings.branding.preview_description') }}
        </p>

        <div class="mt-3 grid gap-4 md:grid-cols-2">
          <div class="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
            <div
              class="h-16"
              :style="{ background: brandingPreviewStyles.headerGradient }"
            ></div>
            <div class="px-4 py-3 text-sm text-gray-600">
              {{ $t('settings.branding.preview_header_caption') }}
            </div>
          </div>

          <div
            class="overflow-hidden rounded-lg border shadow-sm"
            :style="{ borderColor: brandingPreviewStyles.sidebarBorder }"
          >
            <div class="flex">
              <div
                class="w-32 space-y-2 p-4 text-xs"
                :style="{
                  backgroundColor: brandingPreviewStyles.sidebarBackground,
                  color: brandingPreviewStyles.sidebarText,
                }"
              >
                <div
                  class="rounded-md px-2 py-1 font-medium"
                  :style="{
                    backgroundColor: brandingPreviewStyles.sidebarActiveBackground,
                    color: brandingPreviewStyles.sidebarActiveText,
                  }"
                >
                  {{ $t('settings.branding.preview_active_link') }}
                </div>
                <div class="rounded-md px-2 py-1 opacity-80">
                  {{ $t('settings.branding.preview_inactive_link') }}
                </div>
              </div>
              <div class="flex-1 p-5 text-xs text-gray-500">
                {{ $t('settings.branding.preview_sidebar_caption') }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <BaseButton
        class="mt-6"
        :disabled="isSaving"
        :loading="isSaving"
        type="submit"
      >
        <template #left="slotProps">
          <BaseIcon name="ArrowDownOnSquareIcon" :class="slotProps.class" />
        </template>
        {{ $t('general.save') }}
      </BaseButton>
    </BaseSettingCard>
  </form>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCompanyStore } from '@/scripts/admin/stores/company'
import { useVuelidate } from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
import {
  DEFAULT_BRANDING,
  normalizeHexColor,
  isValidHexColor,
  generatePrimaryPalette,
  mixHexColors,
  isLightHexColor,
} from '@/scripts/admin/utils/branding'

const HEX_REGEX = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/
const BRANDING_FORM_DEFAULTS = {
  primary_color: DEFAULT_BRANDING.primaryColor,
  sidebar_background_color: DEFAULT_BRANDING.sidebarBackgroundColor,
  sidebar_text_color: DEFAULT_BRANDING.sidebarTextColor,
}

const companyStore = useCompanyStore()
const { t } = useI18n()
const isSaving = ref(false)

const brandingForm = reactive({
  primary_color: normalizeHexColor(
    companyStore.selectedCompanySettings?.brand_primary_color,
    BRANDING_FORM_DEFAULTS.primary_color
  ),
  sidebar_background_color: normalizeHexColor(
    companyStore.selectedCompanySettings?.brand_sidebar_background_color,
    BRANDING_FORM_DEFAULTS.sidebar_background_color
  ),
  sidebar_text_color: normalizeHexColor(
    companyStore.selectedCompanySettings?.brand_sidebar_text_color,
    BRANDING_FORM_DEFAULTS.sidebar_text_color
  ),
})

watch(
  () => companyStore.selectedCompanySettings,
  (settings) => {
    brandingForm.primary_color = normalizeHexColor(
      settings?.brand_primary_color,
      BRANDING_FORM_DEFAULTS.primary_color
    )
    brandingForm.sidebar_background_color = normalizeHexColor(
      settings?.brand_sidebar_background_color,
      BRANDING_FORM_DEFAULTS.sidebar_background_color
    )
    brandingForm.sidebar_text_color = normalizeHexColor(
      settings?.brand_sidebar_text_color,
      BRANDING_FORM_DEFAULTS.sidebar_text_color
    )
  },
  { deep: true }
)

const rules = computed(() => ({
  primary_color: {
    required: helpers.withMessage(t('validation.required'), required),
    hex: helpers.withMessage(
      t('validation.hex_color'),
      helpers.regex('hex', HEX_REGEX)
    ),
  },
  sidebar_background_color: {
    required: helpers.withMessage(t('validation.required'), required),
    hex: helpers.withMessage(
      t('validation.hex_color'),
      helpers.regex('hex', HEX_REGEX)
    ),
  },
  sidebar_text_color: {
    required: helpers.withMessage(t('validation.required'), required),
    hex: helpers.withMessage(
      t('validation.hex_color'),
      helpers.regex('hex', HEX_REGEX)
    ),
  },
}))

const v$ = useVuelidate(rules, brandingForm)

function onBrandingColorInput(key, value) {
  if (!Object.prototype.hasOwnProperty.call(BRANDING_FORM_DEFAULTS, key)) {
    return
  }

  brandingForm[key] = normalizeHexColor(value, BRANDING_FORM_DEFAULTS[key])
  v$.value[key].$touch()
}

function onBrandingHexInput(key, value) {
  if (!Object.prototype.hasOwnProperty.call(BRANDING_FORM_DEFAULTS, key)) {
    return
  }

  if (typeof value !== 'string') {
    brandingForm[key] = ''
    return
  }

  let formatted = value.replace(/[^0-9a-fA-F#]/g, '').toUpperCase()

  if (formatted === '') {
    brandingForm[key] = ''
    return
  }

  if (!formatted.startsWith('#')) {
    formatted = `#${formatted.replace(/#/g, '')}`
  } else if (formatted.indexOf('#', 1) !== -1) {
    formatted = `#${formatted.slice(1).replace(/#/g, '')}`
  }

  brandingForm[key] = formatted
}

function onBrandingHexBlur(key) {
  if (!Object.prototype.hasOwnProperty.call(BRANDING_FORM_DEFAULTS, key)) {
    return
  }

  const value = brandingForm[key]
  const fallback = BRANDING_FORM_DEFAULTS[key]

  if (!value) {
    brandingForm[key] = fallback
    return
  }

  if (!isValidHexColor(value)) {
    brandingForm[key] = fallback
  } else {
    brandingForm[key] = normalizeHexColor(value, fallback)
  }

  v$.value[key].$touch()
}

function rgbToCss(rgb) {
  if (!rgb) {
    return 'rgb(74, 61, 255)'
  }

  return `rgb(${Math.round(rgb.r)}, ${Math.round(rgb.g)}, ${Math.round(rgb.b)})`
}

const brandingPreviewStyles = computed(() => {
  const palette = generatePrimaryPalette(brandingForm.primary_color)
  const headerStart = rgbToCss(palette[500])
  const headerEnd = rgbToCss(palette[400] || palette[500])

  const primaryHex = normalizeHexColor(
    brandingForm.primary_color,
    BRANDING_FORM_DEFAULTS.primary_color
  )
  const sidebarBackground = normalizeHexColor(
    brandingForm.sidebar_background_color,
    BRANDING_FORM_DEFAULTS.sidebar_background_color
  )
  const sidebarText = normalizeHexColor(
    brandingForm.sidebar_text_color,
    BRANDING_FORM_DEFAULTS.sidebar_text_color
  )

  const sidebarActiveBackground = rgbToCss(
    mixHexColors(
      sidebarBackground,
      primaryHex,
      18,
      sidebarBackground,
      primaryHex
    )
  )

  const sidebarIsLight = isLightHexColor(
    sidebarBackground,
    BRANDING_FORM_DEFAULTS.sidebar_background_color
  )

  const sidebarBorder = rgbToCss(
    mixHexColors(
      sidebarBackground,
      sidebarIsLight ? '#000000' : '#FFFFFF',
      sidebarIsLight ? 24 : 18,
      sidebarBackground,
      sidebarIsLight ? '#000000' : '#FFFFFF'
    )
  )

  return {
    headerGradient: `linear-gradient(90deg, ${headerStart} 0%, ${headerEnd} 100%)`,
    sidebarBackground,
    sidebarText,
    sidebarActiveBackground,
    sidebarActiveText: primaryHex,
    sidebarBorder,
  }
})

async function submitBranding() {
  v$.value.$touch()
  if (v$.value.$invalid) {
    return
  }

  isSaving.value = true
  try {
    const payload = {
      settings: {
        brand_primary_color: normalizeHexColor(
          brandingForm.primary_color,
          BRANDING_FORM_DEFAULTS.primary_color
        ),
        brand_sidebar_background_color: normalizeHexColor(
          brandingForm.sidebar_background_color,
          BRANDING_FORM_DEFAULTS.sidebar_background_color
        ),
        brand_sidebar_text_color: normalizeHexColor(
          brandingForm.sidebar_text_color,
          BRANDING_FORM_DEFAULTS.sidebar_text_color
        ),
      },
    }

    await companyStore.updateCompanySettings({
      data: payload,
      message: 'settings.branding.updated',
    })
  } finally {
    isSaving.value = false
  }
}
</script>
