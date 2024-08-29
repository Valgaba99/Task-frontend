import { Task } from './../../model/task';
import { TaskService } from './../../service/taskservice';
import { StatetaskService } from './../../service/statetaskservice';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { EditorModule } from 'primeng/editor';
import { TableModule } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { Statetask } from '../../model/statetask';

interface Asignados {
  id: number;
  nombre: string;
}

interface State {
  id?: number;
  nombre?: string;
}

@Component({
  selector: 'app-home-page',
  standalone: true,
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  imports: [
    CommonModule,
    ButtonModule,
    DialogModule,
    EditorModule,
    TableModule,
    ToastModule,
    DropdownModule,
    FormsModule,
  ],
  providers: [TaskService, StatetaskService, MessageService],
})
export class HomePageComponent implements OnInit {
  empForm: FormGroup | undefined;
  displayDialog: boolean = false;
  submitted: boolean = false;
  usuario: string = 'Víctor Algaba Bueno';
  asignados: Asignados[] | undefined;
  selectasignado: Asignados | undefined;
  currentstateask = new Statetask();
  state: State[] | undefined;
  statemodel: Statetask[] | undefined;
  selectestado: State | undefined;
  currentTask = new Task();
  alltasks!: Task[];
  statusCode: number | undefined;
  currentIndex = -1;
  messageService: any;

  constructor(private taskService: TaskService, private statetaskService: StatetaskService) {}

  ngOnInit() {
    this.retrieveStatetasks()
    this.asignados = [
      { id: 1, nombre: 'Alfredo moreno lopez' },
      { id: 2, nombre: 'Emilio garcia lora' },
      { id: 3, nombre: 'Víctor algaba bueno' },
    ];
    this.retrieveTasks();
  }

  task: Task = {
    nombre: '',
    asignadoa: '',
    estado: '',
    descripcion: '',
  };

  // Obtener todas las tareas de la API y insertar en la tabla
  retrieveTasks(): void {
    this.taskService.getAll().subscribe({
      next: (data) => {
        this.alltasks = data;
      },
      error: (e) => console.error(e),
    });
  }

  retrieveStatetasks(): void {
    this.statetaskService.getAll().subscribe({
      next: (data) => {
        this.statemodel = data;
        this.state = this.statemodel
      },
      error: (e) => console.error(e),
    });
  }

  showDialogAdd() {
    this.displayDialog = true;
  }

  saveaddTask(): void {
    if (!this.selectasignado || !this.selectestado) {
      console.error('Asignado a o Estado no están definidos');
      return;
    }

    this.currentTask = {
      nombre: this.currentTask.nombre,
      asignadoa: this.selectasignado.nombre,
      estado: this.selectestado.nombre,
      descripcion: this.currentTask.descripcion,
    };
    console.log(this.currentTask);

    this.taskService.create(this.currentTask).subscribe({
      next: (res) => {
        console.log(res);
        this.displayDialog = false;
        this.submitted = true;
        this.resetTask();
        this.retrieveTasks();
      },
      error: (e) => {
        console.error(e);
      },
    });
  }

  deleteTask(id: number) {
    this.taskService.delete(id).subscribe({
      next: (res) => {
        console.log(res);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Tarea borrada correctamente',
        });
        //this.alltasks = this.alltasks.filter(task => task.id !== id)
      },
      error: (e) => {
        console.error(e);
      },
    });
  }

  openEditForm(id: number, data: Task) {
    this.displayDialog = true;
    console.log(data)
    this.currentTask = {
      nombre: data.nombre,
      asignadoa: data.asignadoa,
      estado: data.estado,
      descripcion: data.descripcion,
    };
    console.log(data)
    this.taskService.update(id, data).subscribe({
      next: (res) => {
        console.log(res);
        this.retrieveTasks();
      },
      error: (e) => {
        console.error(e);
      },
    });
  }

  editForm(id: number) {
    let selecttaks = this.alltasks.find((p) => {p.id === id})
    this.displayDialog = true;
    this.currentTask = {
      nombre: selecttaks!.nombre,
      asignadoa: selecttaks!.asignadoa,
      estado: selecttaks!.estado!,
      descripcion: selecttaks!.descripcion,
    };
  }

  resetTask(): void {
    this.submitted = false;
    this.currentTask = {
      nombre: '',
      asignadoa: '',
      estado: '',
      descripcion: '',
    };
  }
}
