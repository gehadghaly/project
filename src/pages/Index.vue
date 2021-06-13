<template>
  <div class="q-pa-md">
    <div class="q-gutter-md" style="max-width: 300px;display:flex">
      <q-input v-model.trim="text" label="Standard" />
      <q-btn flat color="primary" icon="add" @click="addTodoList" />
    </div>
    <div class="q-pa-md" style="max-width: 350px;">
      <q-list bordered separator style="border:none">
        <q-item v-for="(todo, index) in todoList" :key="todo.id">
          <q-item-section
            >{{ index + 1 }} - {{ todo.key }}
          </q-item-section>
          <q-item-section>
            <q-btn
              size="medium"
              color="primary"
              icon="edit"
              flat
              @click="editItem(todo)"
            />
          </q-item-section>
          <q-item-section>
            <q-btn
              size="small"
              color="red"
              icon="delete"
              flat
              @click="removeItem(todo)"
            />
          </q-item-section>
            <q-item-section v-for="Json in myJson" :key="Json.id"
            >{{Json[0].name}}
          </q-item-section>
        </q-item>
      </q-list>
    </div>
    <q-dialog v-model="alert">
      <q-card>
        <q-card-section>
          <div class="text-h6">Notice</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          {{ warningAlert }}
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- dialog for edit  -->
    <q-dialog v-model="prompt" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Edit Item</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense v-model="editText" autofocus />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Edit" v-close-popup @click="edited" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import axios  from 'axios'
export default {
  name: "todoList",
  data() {
    return {
      text: "",
      todoList: [],
      warningAlert: "",
      alert: false,
      id: 0,
      prompt: false,
      editId: 0,
      editText: "",
      // clicked :false
      myJson:[]
    };
  },
  // on load
  mounted() {
    let value = this.$q.localStorage.getItem("todoList");
    if (value) {
      this.todoList = value;
      this.id = this.heightId2();
    }axios
      .get(`https://api.github.com/search/repositories?q=created:%3E2017-10-22&sort=stars&order=desc`)
      .then(response => {
        this.myJson = response.data
      })
      .catch(error => console.log('Error', error.message))
  },
  created() {},
  methods: {
    addTodoList() {
      if (!this.text.length) {
        this.warningAlert = "You Should Write Something";
        this.alert = true;
      } else if (this.notDoublicated()) {
        this.warningAlert = "It Has Been Written Before";
        this.alert = true;
      } else {
        this.todoList.push({
          key: this.makeUpperCase(this.text),
          id: this.addId()
        });
        this.$q.localStorage.set("todoList", this.todoList);
        this.text = "";
        console.log(this.todoList);
      }
    },
    makeUpperCase(item) {
      let words = item.split(" ");
      console.log(words);
      let wordsArr = words.map(v => {
        v = v[0].toUpperCase() + v.slice(1);
        return v;
      });
      return wordsArr.join(" ");
    },
    heightId() {
      let id = 0;
      this.todoList.map(v => {
        if (id < v.id) {
          id = v.id;
        }
      });
      return id;
    },
    heightId2() {
      return this.todoList[this.todoList.length - 1].id;
    },
    notDoublicated() {
      let double = false;

      this.todoList.map(v => {
        if (v.key === this.text) {
          double = true;
        }
      });
      return double;
    },
    removeItem(item) {
      this.todoList = this.todoList.filter(v => v.key !== item.key);
      this.$q.localStorage.set("todoList", this.todoList);
    },
    addId() {
      this.id = this.id + 1;
      return this.id;
    },
    editItem(item) {
      this.todoList.map(v => {
        if (v.id === item.id) {
          this.editText = v.key;
          this.editId = v.id;
        }
      });
      this.prompt = true;
    },
    edited() {
      this.todoList.map(v => {
        if (v.id === this.editId) {
          v.key = this.editText;
        }
      });
      this.$q.localStorage.set("todoList", this.todoList);
    },

  }
};
</script>

