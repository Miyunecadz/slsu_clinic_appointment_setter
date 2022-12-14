<script setup>
import SidebarComponent from "../components/SidebarComponent.vue";
import { useUserStore } from "@/stores/user";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import ModalComponent from "../components/ModalComponent.vue";
import RatingModalComponent from "../components/RatingModalComponent.vue";

const userStore = useUserStore().authUser;
const appointments = ref({});
const getAppointments = async () => {
  const response = await axios.post(
    "http://localhost:3000/appointments/my-appointments",
    {
      userId: userStore.id,
    }
  );
  appointments.value = response.data.appointments;
};

const appointmentModalData = ref({});
const scheduleModalData = ref({});
const setAppointmentDataInModal = (appointment) => {
  appointmentModalData.value = appointment;
  scheduleModalData.value = appointment.schedule;
};

const appointmentRatingModalData = ref({});
const setAppointmentDataInRatingModal = (appointment) => {
  appointmentRatingModalData.value = appointment;
};

const addAppointmentRating = async (appointmentId, rating, comment) => {
  const url = "http://localhost:3000/appointments/add-rating";
  let response = await axios.post(url, {
    appointmentId: appointmentId,
    rating: rating,
    comment: comment,
  });
  response = await response.data;

  if (!response.result) {
    return Swal.fire({
      icon: "error",
      title: "Oops...",
      text: response.message,
    });
  }

  await getAppointments();
  return Swal.fire({
    icon: "success",
    title: "Success!",
    text: response.message,
  });
};

onMounted(async () => {
  await getAppointments();
});
</script>

<template>
  <SidebarComponent>
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-10 my-auto">
          <h3>Appointment History</h3>
          <table class="table">
            <thead>
              <tr>
                <th scope="col">Appointment Title</th>
                <th scope="col">Date</th>
                <th scope="col">Time</th>
                <th scope="col">Status</th>
                <th scope="col">Rating</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody class="table-group-divider">
              <tr v-for="appointment in appointments" :key="appointment.id">
                <td>{{ appointment.schedule.service_type }}</td>
                <td>{{ appointment.schedule.date }}</td>
                <td>{{ appointment.schedule.time }}</td>
                <td>{{ appointment.status }}</td>
                <td>{{ appointment.rating ?? '0' }}</td>
                <td class="d-flex gap-2">
                  <div class="view-appointment">
                    <button
                      type="button"
                      class="btn btn-outline-secondary"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                      @click="setAppointmentDataInModal(appointment)"
                    >
                      View Details
                    </button>
                    <ModalComponent
                      :appointment="appointmentModalData"
                      :schedule="scheduleModalData"
                    />
                  </div>
                  <div class="rate-appointment">
                    <Button
                      type="button"
                      v-if="
                        appointment.status == 'approved' &&
                        (appointment.rating == null || appointment.rating == 0)
                      "
                      class="btn btn-outline-success"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal1"
                      @click="setAppointmentDataInRatingModal(appointment)"
                    >
                      Rate
                    </Button>
                    <RatingModalComponent
                      :appointment="appointmentRatingModalData"
                      :addAppointmentRating="addAppointmentRating"
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </SidebarComponent>
</template>
