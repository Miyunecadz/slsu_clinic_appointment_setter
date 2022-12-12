import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import SetView from '../views/SetView.vue'
import DashboardView from '../views/DashboardView.vue'
import ProfileView from '../views/ProfileView.vue'
import UpdateProfileView from '../views/UpdateProfileView.vue'
import AppointmentHistoryView from '../views/AppointmentHistoryView.vue'
import SpecialistDashboardView from '../views/SpecialistDashboardView.vue'
import SpecialistSetScheduleView from '../views/SpecialistSetScheduleView.vue'
import SpecialistAppointmentView from '../views/SpecialistAppointmentView.vue'
import AdminDashboardView from '../views/AdminDashboardView.vue'
import AdminAddSpecialistView from '../views/AdminAddSpecialistView.vue'
import AdminManageSpecialistView from '../views/AdminManageSpecialistView.vue'

import auth from '../middleware/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/set',
      name: 'set',
      component: SetView,
      meta: {
        middleware: auth
      } 
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      // Gawskie kung gusto ka maka sud sa dashbaord
      // e comment rani meta kutob sa iyahang closing brace
      meta: {
        middleware: auth
      } // kani
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: {
        middleware: auth
      } // kani
    },
    {
      path: '/updateprofile',
      name: 'updateprofile',
      component: UpdateProfileView,
      meta: {
        middleware: auth
      } // kani
    },
    {
      path: '/appointment-history',
      name: 'appointmenthistory',
      component: AppointmentHistoryView,
      meta: {
        middleware: auth
      } // kani
    },
    {
      path: '/specialistdashboard',
      name: 'specialistdashboard',
      component: SpecialistDashboardView,
      meta: {
        middleware: auth
      } // kani
    },
    {
      path: '/specialistsetschedule',
      name: 'specialistsetschedule',
      component: SpecialistSetScheduleView,
      meta: {
        middleware: auth
      } // kani
    },
    {
      path: '/specialistappointment',
      name: 'specialistappoinment',
      component: SpecialistAppointmentView,
      meta: {
        middleware: auth
      } // kani
    },
    {
      path: '/admindashboard',
      name: 'admindashboard',
      component: AdminDashboardView,
      meta: {
        middleware: auth
      } // kani
    },
    {
      path: '/adminaddspecialist',
      name: 'adminaddspecialist',
      component: AdminAddSpecialistView,
      meta: {
        middleware: auth
      } // kani
    },
    {
      path: '/adminmanagespecialist',
      name: 'adminmanagespecialist',
      component: AdminManageSpecialistView,
      meta: {
        middleware: auth
      } // kani
    }
    

  ]
})


function nextFactory(context, middleware, index) {
  const subsequentMiddleware = middleware[index];
  // If no subsequent Middleware exists,
  // the default `next()` callback is returned.
  if (!subsequentMiddleware) return context.next;

  return (...parameters) => {
    // Run the default Vue Router `next()` callback first.
    context.next(...parameters);
    // Then run the subsequent Middleware with a new
    // `nextMiddleware()` callback.
    const nextMiddleware = nextFactory(context, middleware, index + 1);
    subsequentMiddleware({ ...context, next: nextMiddleware });
  };
}

router.beforeEach((to, from, next) => {
  if (to.meta.middleware) {
    const middleware = Array.isArray(to.meta.middleware)
      ? to.meta.middleware
      : [to.meta.middleware];

    const context = {
      from,
      next,
      router,
      to,
    };
    const nextMiddleware = nextFactory(context, middleware, 1);

    return middleware[0]({ ...context, next: nextMiddleware });
  }

  return next();
});

export default router
