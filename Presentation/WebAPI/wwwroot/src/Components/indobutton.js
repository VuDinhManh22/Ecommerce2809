/*
 ----------------------------------------------------------------------------
 Developer: Ismail Hamzah
 Email: go2ismail@gmail.com
 ----------------------------------------------------------------------------
*/

import { defineComponent } from 'vue'

export default defineComponent({
props: {
    type: {
        type: String,
        default: 'button'
    },
    isSubmitting: {
        type: Boolean,
        default: false
    },
    submittingText: {
        type: String,
        default: 'Submitting...'
    },
    defaultText: {
        type: String,
        default: 'Submit'
    },
    buttonClass: {
        type: String,
        default: 'btn btn-primary mt-3'
    }
},
setup(props, { emit }) {

    const handleClick = (e) => {
        e.stopPropagation()
        emit('click')
    }

    return { handleClick }
},
template: `
        <button
        :type="type"
        :class="buttonClass"
        :disabled="isSubmitting"
        v-on:click="handleClick">
            <span v-if="isSubmitting">{{ submittingText }}</span>
            <span v-else><slot>{{ defaultText }}</slot></span>
        </button>
`
})
