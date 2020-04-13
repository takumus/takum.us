<template>
  <Error message="Why are you still using Internet Explorer?" />
</template>
<script lang="ts">
import Error from '@/components/Error.vue';
import { Component, Vue } from "vue-property-decorator";
@Component({ components: { Error } })
export default class IE11 extends Vue { }
</script>