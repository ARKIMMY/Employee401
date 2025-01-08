<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;

    // ระบุชื่อตารางในฐานข้อมูล 
    protected $table = 'employees';

    // ระบุคอลัมน์ที่สามารถบันทึกข้อมูลได้
    protected $fillable = ['name', 'position', 'department'];
}