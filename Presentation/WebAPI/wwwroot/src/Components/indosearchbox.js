/*
 ----------------------------------------------------------------------------
 Developer: Ismail Hamzah
 Email: go2ismail@gmail.com
 ----------------------------------------------------------------------------
*/

import { defineComponent, ref } from 'vue';

export default defineComponent({
    setup(props, { emit }) {
        const searchQuery = ref('')
        const handleSearchInput = (event) => {
            searchQuery.value = event.target.value
        }
        const handleSearchAction = async () => {
            emit('search-action', { searchQuery: searchQuery.value });
        }

        return {
            handleSearchInput,
            handleSearchAction
        }
    },
    template: `
    <div class="input-group">
        <button class="input-group-text" v-on:click="handleSearchAction">
            <i class="bi bi-search"></i>
        </button>
        <input type="text"
                class="form-control"
                placeholder="Search..."
                v-on:input="handleSearchInput"
                v-on:keyup.enter="handleSearchAction">
    </div>
  `
})
