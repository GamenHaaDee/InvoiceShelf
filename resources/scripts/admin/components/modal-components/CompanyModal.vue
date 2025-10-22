<template>
  <BaseModal :show="modalActive" @close="closeCompanyModal" @open="getInitials">
    <template #header>
      <div class="flex justify-between w-full">
        {{ modalStore.title }}

        <BaseIcon
          name="XMarkIcon"
          class="w-6 h-6 text-gray-500 cursor-pointer"
          @click="closeCompanyModal"
        />
      </div>
    </template>
    <form action="" @submit.prevent="submitCompanyData">
      <div class="p-4 mb-16 sm:p-6 space-y-4">
        <BaseInputGrid layout="one-column">
          <BaseInputGroup
            :content-loading="isFetchingInitialData"
            :label="$t('settings.company_info.company_logo')"
          >
            <BaseContentPlaceholders v-if="isFetchingInitialData">
              <BaseContentPlaceholdersBox :rounded="true" class="w-full h-24" />
            </BaseContentPlaceholders>
            <div v-else class="flex flex-col items-center">
              <BaseFileUploader
                :preview-image="previewLogo"
                base64
                @remove="onFileInputRemove"
                @change="onFileInputChange"
              />
            </div>
          </BaseInputGroup>

          <BaseInputGroup
            :label="$t('settings.company_info.company_name')"
            :error="
              v$.newCompanyForm.name.$error &&
              v$.newCompanyForm.name.$errors[0].$message
            "
            :content-loading="isFetchingInitialData"
            required
          >
            <BaseInput
              v-model="newCompanyForm.name"
              :invalid="v$.newCompanyForm.name.$error"
              :content-loading="isFetchingInitialData"
              @input="v$.newCompanyForm.name.$touch()"
            />
          </BaseInputGroup>

          <BaseInputGroup
            :content-loading="isFetchingInitialData"
            :label="$t('settings.company_info.country')"
            :error="
              v$.newCompanyForm.address.country_id.$error &&
              v$.newCompanyForm.address.country_id.$errors[0].$message
            "
            required
          >
            <BaseMultiselect
              v-model="newCompanyForm.address.country_id"
              :content-loading="isFetchingInitialData"
              label="name"
              :invalid="v$.newCompanyForm.address.country_id.$error"
              :options="globalStore.countries"
              value-prop="id"
              :can-deselect="true"
              :can-clear="false"
              searchable
              track-by="name"
            />
          </BaseInputGroup>

          <BaseInputGroup
            :label="$t('wizard.currency')"
            :error="
              v$.newCompanyForm.currency.$error &&
              v$.newCompanyForm.currency.$errors[0].$message
            "
            :content-loading="isFetchingInitialData"
            :help-text="$t('wizard.currency_set_alert')"
            required
          >
            <BaseMultiselect
              v-model="newCompanyForm.currency"
              :content-loading="isFetchingInitialData"
              :options="globalStore.currencies"
              label="name"
              value-prop="id"
              :searchable="true"
              track-by="name"
              :placeholder="$t('settings.currencies.select_currency')"
              :invalid="v$.newCompanyForm.currency.$error"
              class="w-full"
            >
            </BaseMultiselect>
          </BaseInputGroup>
        </BaseInputGrid>

        <div class="pt-4 mt-6 border-t border-gray-200 space-y-4">
          <div
            class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h3 class="text-base font-medium text-gray-900">
                {{ $t('settings.mail_servers.title') }}
              </h3>
              <p class="mt-1 text-sm text-gray-500">
                {{ $t('settings.mail_servers.description') }}
              </p>
            </div>
            <BaseButton
              type="button"
              variant="secondary"
              size="sm"
              :disabled="newCompanyForm.mail_servers.length >= MAIL_SERVER_LIMIT"
              @click="addMailServer"
            >
              <template #left="slotProps">
                <BaseIcon name="PlusIcon" :class="slotProps.class" />
              </template>
              {{ $t('settings.mail_servers.add') }}
            </BaseButton>
          </div>

          <div
            v-if="newCompanyForm.mail_servers.length"
            class="space-y-4"
          >
            <BaseCard
              v-for="(server, index) in newCompanyForm.mail_servers"
              :key="server.uid"
              class="p-4 space-y-4"
            >
              <div class="flex items-start justify-between gap-3">
                <h4 class="text-sm font-medium text-gray-900">
                  {{
                    $t('settings.mail_servers.server_label', {
                      number: index + 1,
                    })
                  }}
                </h4>
                <BaseButton
                  v-if="newCompanyForm.mail_servers.length > 1"
                  type="button"
                  variant="white"
                  size="sm"
                  @click="removeMailServer(index)"
                >
                  <template #left="slotProps">
                    <BaseIcon name="TrashIcon" :class="slotProps.class" />
                  </template>
                  {{ $t('general.remove') }}
                </BaseButton>
              </div>

              <BaseInputGrid layout="two-column" class="gap-4">
                <BaseInputGroup
                  :label="$t('settings.mail_servers.label')"
                  class="col-span-2"
                >
                  <BaseInput v-model.trim="server.label" />
                </BaseInputGroup>

                <BaseInputGroup :label="$t('settings.mail.host')">
                  <BaseInput v-model.trim="server.host" />
                </BaseInputGroup>

                <BaseInputGroup :label="$t('settings.mail.port')">
                  <BaseInput
                    v-model.number="server.port"
                    type="number"
                    min="1"
                    max="65535"
                    placeholder="587"
                  />
                </BaseInputGroup>

                <BaseInputGroup :label="$t('settings.mail.username')">
                  <BaseInput
                    v-model.trim="server.username"
                    autocomplete="username"
                  />
                </BaseInputGroup>

                <BaseInputGroup :label="$t('settings.mail.password')">
                  <BaseInput
                    v-model="server.password"
                    type="password"
                    autocomplete="new-password"
                  />
                </BaseInputGroup>

                <BaseInputGroup :label="$t('settings.mail.encryption')">
                  <BaseSelectInput
                    v-model="server.encryption"
                    :options="mailEncryptionOptions"
                    value-prop="id"
                    label-key="label"
                    :allow-empty="false"
                    :searchable="false"
                  />
                </BaseInputGroup>

                <BaseInputGroup :label="$t('settings.mail.from_name')">
                  <BaseInput v-model.trim="server.from_name" />
                </BaseInputGroup>

                <BaseInputGroup :label="$t('settings.mail.from_mail')">
                  <BaseInput
                    v-model.trim="server.from_address"
                    type="email"
                    autocomplete="email"
                  />
                </BaseInputGroup>

                <div class="col-span-2">
                  <BaseCheckbox
                    v-model="server.is_primary"
                    :label="$t('settings.mail_servers.primary')"
                    @change="onPrimaryMailServerChange($event, index)"
                  />
                </div>
              </BaseInputGrid>
            </BaseCard>
          </div>

          <p v-else class="text-sm text-gray-500">
            {{ $t('settings.mail_servers.empty') }}
          </p>

          <p
            v-if="newCompanyForm.mail_servers.length >= MAIL_SERVER_LIMIT"
            class="text-xs text-gray-500"
          >
            {{
              $t('settings.mail_servers.limit_reached', {
                count: MAIL_SERVER_LIMIT,
              })
            }}
          </p>
        </div>
      </div>

      <div class="z-0 flex justify-end p-4 bg-gray-50 border-modal-bg">
        <BaseButton
          class="mr-3 text-sm"
          variant="primary-outline"
          outline
          type="button"
          @click="closeCompanyModal"
        >
          {{ $t('general.cancel') }}
        </BaseButton>
        <BaseButton
          :loading="isSaving"
          :disabled="isSaving"
          variant="primary"
          type="submit"
        >
          <template #left="slotProps">
            <BaseIcon
              v-if="!isSaving"
              name="ArrowDownOnSquareIcon"
              :class="slotProps.class"
            />
          </template>
          {{ $t('general.save') }}
        </BaseButton>
      </div>
    </form>
  </BaseModal>
</template>

<script setup>
import { useModalStore } from '@/scripts/stores/modal'
import { computed, ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { required, minLength, helpers } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { useCompanyStore } from '@/scripts/admin/stores/company'
import { useGlobalStore } from '@/scripts/admin/stores/global'
import { useRouter } from 'vue-router'

const router = useRouter()
const companyStore = useCompanyStore()
const modalStore = useModalStore()
const globalStore = useGlobalStore()

const { t } = useI18n()
const MAIL_SERVER_LIMIT = 3

const mailEncryptionOptions = computed(() => [
  { id: 'tls', label: t('settings.mail.encryption_tls') },
  { id: 'ssl', label: t('settings.mail.encryption_ssl') },
  { id: 'none', label: t('settings.mail.encryption_none') },
])

let isSaving = ref(false)
let previewLogo = ref(null)
let isFetchingInitialData = ref(false)
let companyLogoFileBlob = ref(null)
let companyLogoName = ref(null)

const newCompanyForm = reactive({
  name: null,
  currency: '',
  address: {
    country_id: null,
  },
  mail_servers: [],
})

const modalActive = computed(() => {
  return modalStore.active && modalStore.componentName === 'CompanyModal'
})

const rules = {
  newCompanyForm: {
    name: {
      required: helpers.withMessage(t('validation.required'), required),
      minLength: helpers.withMessage(
        t('validation.name_min_length', { count: 3 }),
        minLength(3)
      ),
    },
    address: {
      country_id: {
        required: helpers.withMessage(t('validation.required'), required),
      },
    },
    currency: {
      required: helpers.withMessage(t('validation.required'), required),
    },
  },
}

const v$ = useVuelidate(rules, { newCompanyForm })

async function getInitials() {
  isFetchingInitialData.value = true
  await globalStore.fetchCurrencies()
  await globalStore.fetchCountries()

  newCompanyForm.currency = companyStore.selectedCompanyCurrency.id
  newCompanyForm.address.country_id =
    companyStore.selectedCompany.address.country_id

  isFetchingInitialData.value = false
}

function onFileInputChange(fileName, file) {
  companyLogoName.value = fileName
  companyLogoFileBlob.value = file
}

function onFileInputRemove() {
  companyLogoName.value = null
  companyLogoFileBlob.value = null
}

async function submitCompanyData() {
  v$.value.newCompanyForm.$touch()
  if (v$.value.$invalid) {
    return true
  }

  isSaving.value = true
  try {
    const payload = prepareCompanyPayload()
    const res = await companyStore.addNewCompany(payload)
    if (res.data.data) {
      await companyStore.setSelectedCompany(res.data.data)
      if (companyLogoFileBlob && companyLogoFileBlob.value) {
        let logoData = new FormData()

        logoData.append(
          'company_logo',
          JSON.stringify({
            name: companyLogoName.value,
            data: companyLogoFileBlob.value,
          })
        )

        await companyStore.updateCompanyLogo(logoData)
        router.push('/admin/dashboard')
      }
      await globalStore.setIsAppLoaded(false)
      await globalStore.bootstrap()
      closeCompanyModal()
    }
    isSaving.value = false
  } catch {
    isSaving.value = false
  }
}

function resetNewCompanyForm() {
  newCompanyForm.name = ''
  newCompanyForm.currency = ''
  newCompanyForm.address.country_id = ''
  newCompanyForm.mail_servers = []

  v$.value.$reset()
}

function closeCompanyModal() {
  modalStore.closeModal()

  setTimeout(() => {
    resetNewCompanyForm()
    v$.value.$reset()
  }, 300)
}

function generateMailServerUid() {
  return `mail-server-${Math.random().toString(36).slice(2, 10)}`
}

function createEmptyMailServer() {
  return {
    uid: generateMailServerUid(),
    label: '',
    driver: 'smtp',
    host: '',
    port: null,
    username: '',
    password: '',
    encryption: 'tls',
    from_name: '',
    from_address: '',
    is_primary: newCompanyForm.mail_servers.length === 0,
  }
}

function addMailServer() {
  if (newCompanyForm.mail_servers.length >= MAIL_SERVER_LIMIT) {
    return
  }

  newCompanyForm.mail_servers.push(createEmptyMailServer())
}

function removeMailServer(index) {
  const [removedServer] = newCompanyForm.mail_servers.splice(index, 1)

  if (removedServer?.is_primary && newCompanyForm.mail_servers.length) {
    newCompanyForm.mail_servers[0].is_primary = true
  }
}

function onPrimaryMailServerChange(value, index) {
  if (!value) {
    newCompanyForm.mail_servers[index].is_primary = true
    return
  }

  newCompanyForm.mail_servers.forEach((server, serverIndex) => {
    server.is_primary = serverIndex === index
  })
}

function sanitizeMailServersForRequest(servers) {
  if (!Array.isArray(servers)) {
    return []
  }

  return servers
    .map((server) => {
      const trimmedHost = server.host ? server.host.trim() : ''
      const trimmedUsername = server.username ? server.username.trim() : ''
      const trimmedPassword =
        typeof server.password === 'string' ? server.password.trim() : ''
      const trimmedFromName = server.from_name ? server.from_name.trim() : ''
      const trimmedFromAddress = server.from_address
        ? server.from_address.trim()
        : ''

      const hasContent =
        trimmedHost ||
        (server.port !== null && server.port !== undefined && server.port !== '') ||
        trimmedUsername ||
        trimmedPassword ||
        trimmedFromName ||
        trimmedFromAddress

      if (!hasContent) {
        return null
      }

      return {
        label: server.label ? server.label.trim() : null,
        driver: server.driver || 'smtp',
        host: trimmedHost,
        port: server.port,
        username: trimmedUsername || null,
        password: trimmedPassword || null,
        encryption: server.encryption || 'tls',
        from_name: trimmedFromName || null,
        from_address: trimmedFromAddress || null,
        is_primary: Boolean(server.is_primary),
      }
    })
    .filter((server) => server)
}

function prepareCompanyPayload() {
  const payload = JSON.parse(JSON.stringify(newCompanyForm))
  const sanitizedServers = sanitizeMailServersForRequest(payload.mail_servers)

  if (sanitizedServers.length) {
    payload.mail_servers = sanitizedServers
  } else {
    delete payload.mail_servers
  }

  return payload
}
</script>
