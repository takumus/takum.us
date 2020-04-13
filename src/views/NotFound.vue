<template>
  <Error message="404" />
</template>
<script lang="ts">
import Error from '@/components/Error.vue';
import { Component, Vue } from "vue-property-decorator";
@Component({ components: { Error } })
export default class NotFound extends Vue { }
</script>