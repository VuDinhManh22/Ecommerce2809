/*
 ----------------------------------------------------------------------------
 Developer: Ismail Hamzah
 Email: go2ismail@gmail.com
 ----------------------------------------------------------------------------
*/

import { defineComponent } from 'vue'

export default defineComponent({
    template: `
    <div class="d-flex justify-content-center align-items-center"
         style="height: 100vh; background-color: rgba(255, 255, 255, 0.9);">
        <div class="w-50 d-flex flex-column" style="gap: 20px;">
            <div class="skeleton" style="height: 3rem;"></div>
            <div class="skeleton" style="height: 3rem;"></div>
            <div class="skeleton" style="height: 3rem;"></div>
            <div class="skeleton" style="height: 3rem;"></div>
            <div class="skeleton" style="height: 3rem;"></div>
            <div class="skeleton w-100" style="height: 3rem;"></div>
        </div>
    </div>
    `
})
